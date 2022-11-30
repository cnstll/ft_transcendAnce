import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, FriendshipStatus, UserStatus, Match } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Stat } from './interfaces/stats.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { MatchHistory } from './interfaces/matchHistory.interface';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /** User management */

  async createUser(dto: UserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          nickname: dto.nickname,
          immutableId: dto.immutableId.toString(),
          passwordHash: dto.passwordHash,
          avatarImg: dto.avatarImg,
          status: UserStatus.ONLINE,
        },
      });
      /* Check if the immutable ID are those of Colomban, Constant, Estelle or Lea
       to set achievement builder */
      if (
        user.immutableId === '74627' ||
        user.immutableId === '74707' ||
        user.immutableId === '76076' ||
        user.immutableId === '75984'
      )
        this.setAchievement(user.id, 'achievement7');
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      } else {
        throw error;
      }
    }
  }

  async deleteUser(userId: string, res: Response) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return res.send(204);
  }

  async getAllUsers(res: Response) {
    try {
      const nicknames = await this.prismaService.user.findMany({
        select: {
          id: true,
          nickname: true,
          avatarImg: true,
          eloScore: true,
          status: true,
          twoFactorAuthenticationSet: true,
        },
      });
      return res.status(200).send(nicknames);
      //TODO select so you don't return unneeded user info
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  async updateUserName(userId: string, newNickname: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          nickname: newNickname,
        },
      });
      return res.status(201).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  async updateAvatarImg(userId: string, newAvatarImg: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarImg: newAvatarImg,
        },
      });
      return res.status(201).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  async getInfo(userId: string, userId1: string) {
    try {
      const user: User = await this.prismaService.user.findUnique({
        where: {
          id: userId1,
        },
      });
      const friendStatus = await this.getFriendStatus(userId, userId1);
      const userInfo = {
        id: user.id,
        nickname: user.nickname,
        avatarImg: user.avatarImg,
        eloScore: user.eloScore,
        status: user.status,
        friendStatus: friendStatus,
      };
      return userInfo;
    } catch (error) {
      return null;
    }
  }

  async getUserInfo(userId: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      //TODO select useful info
    });
    return user;
  }

  async getFrontUserInfo(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        avatarImg: true,
        nickname: true,
        eloScore: true,
        status: true,
        twoFactorAuthenticationSet: true,
      },
    });
  }

  async findOneFromUserNickname(
    userNickname: string,
  ): Promise<User | undefined> {
    return await this.prismaService.user.findUnique({
      where: {
        nickname: userNickname,
      },
    });
  }

  findOneFromImmutableId(immutableId: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        immutableId: immutableId,
      },
    });
  }

  async logout(res: Response, userId: string) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          status: UserStatus.OFFLINE,
        },
      });
      return res.status(200).clearCookie('jwtToken', { httpOnly: true }).send();
    } catch (error) {}
  }

  /** Friendship management */

  async requestFriend(
    requesterId: string,
    futureFriendNickname: string,
    res: Response,
  ) {
    const futureFriend: User = await this.findOneFromUserNickname(
      futureFriendNickname,
    );
    try {
      await this.prismaService.user.update({
        where: {
          id: requesterId,
        },
        data: {
          friendsRequester: {
            create: [{ addresseeId: futureFriend.id }],
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(201).send();
  }

  async updateFriendshipStatus(
    activeUserId: string,
    affectedUserId: string,
    friends: boolean,
    res: Response,
  ) {
    if (friends === true) {
      this.addFriend(activeUserId, affectedUserId, res);
    } else {
      this.deleteFriendship(activeUserId, affectedUserId, res);
    }
  }

  async deleteFriendship(activeUserId: string, target: string, res: Response) {
    const user: User = await this.findOneFromUserNickname(target);
    try {
      const result = await this.prismaService.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ requesterId: activeUserId }, { addresseeId: user.id }],
            },
            {
              AND: [{ addresseeId: activeUserId }, { requesterId: user.id }],
            },
          ],
        },
      });
      await this.prismaService.friendship.delete({
        where: {
          friendshipId: {
            addresseeId: result.addresseeId,
            requesterId: result.requesterId,
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(200).send();
  }

  async addFriend(
    activeUserId: string,
    requesterNickname: string,
    res: Response,
  ) {
    const status: FriendshipStatus = 'ACCEPTED';
    const requester: User = await this.findOneFromUserNickname(
      requesterNickname,
    );
    try {
      await this.prismaService.user.update({
        where: {
          id: activeUserId,
        },
        data: {
          friendsAddressee: {
            update: {
              where: {
                friendshipId: {
                  requesterId: requester.id,
                  addresseeId: activeUserId,
                },
              },
              data: {
                status: status,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
    return res.status(200).send();
  }

  async getUserFriendRequests(userId: string, res: Response) {
    const friends = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendsAddressee: {
          where: {
            status: 'REQUESTED',
          },
          select: {
            requesterId: true,
          },
        },
      },
    });
    const friendsList = [];
    for (let i = 0; i < friends.friendsAddressee.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsAddressee[i].requesterId),
      );
    }
    return res.status(200).send(friendsList);
  }

  async getFriendStatus(userId1: string, userId2: string): Promise<string> {
    try {
      const friendStatus = await this.prismaService.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ requesterId: userId1 }, { addresseeId: userId2 }],
            },
            {
              AND: [{ addresseeId: userId1 }, { requesterId: userId2 }],
            },
          ],
        },
      });
      if (!friendStatus) return null;
      if (friendStatus.status === 'ACCEPTED') {
        return friendStatus.status;
      }
      if (friendStatus.requesterId === userId2) {
        return 'PENDING';
      }
      return 'REQUESTED';
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getTargetInfo(
    activeUserId: string,
    targetUserId: string,
    res: Response,
  ) {
    try {
      const target: User = await this.findOneFromUserNickname(targetUserId);
      const info: {
        id: string;
        nickname: string;
        avatarImg: string;
        eloScore: number;
        status: UserStatus;
        friendStatus: string;
      } = await this.getInfo(activeUserId, target.id);
      return res.status(200).send(info);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getUserFriends(userId: string, res: Response) {
    const friends = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendsRequester: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            addresseeId: true,
          },
        },
        friendsAddressee: {
          where: {
            status: 'ACCEPTED',
          },
          select: {
            requesterId: true,
          },
        },
      },
    });
    const friendsList = [];

    for (let i = 0; i < friends.friendsAddressee.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsAddressee[i].requesterId),
      );
    }
    for (let i = 0; i < friends.friendsRequester.length; i++) {
      friendsList.push(
        await this.getInfo(userId, friends.friendsRequester[i].addresseeId),
      );
    }
    /* Set achievement social animal */
    if (friendsList.length === 1) this.setAchievement(userId, 'achievement2');
    return res.status(200).send(friendsList);
  }

  /**
   *
   *  2FA functions
   */

  async toggleTwoFactorAuthentication(secret: string, userId: string) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSecret: secret,
          twoFactorAuthenticationSet: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
    return;
  }

  async enableTwoFactorAuthentication(userId: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorAuthenticationSet: true,
        },
      });
      /* Set achievement security first */
      this.setAchievement(userId, 'achievement5');
      return res.status(200).send();
    } catch (error) {
      console.log(error);
    }
    return;
  }

  /** Game management */

  async getUserMatches(userNickname: string) {
    const matches = await this.prismaService.user.findUnique({
      where: {
        nickname: userNickname,
      },
      select: {
        playerOneMatch: {},
        playerTwoMatch: {},
      },
    });
    const matchesList: Match[] = [];

    if (matches?.playerOneMatch !== null) {
      for (let i = 0; i < matches.playerOneMatch.length; i++) {
        matchesList.push(matches.playerOneMatch[i]);
      }
    }
    if (matches?.playerTwoMatch !== null) {
      for (let i = 0; i < matches.playerTwoMatch.length; i++) {
        matchesList.push(matches.playerTwoMatch[i]);
      }
    }
    if (matchesList)
      matchesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return matchesList;
  }

  async getUserMatchesStats(userNickname: string, res: Response) {
    const user = await this.findOneFromUserNickname(userNickname);
    const ranking = await this.getUserRanking(userNickname);
    const stats: Stat = {
      numberOfWin: 0,
      numberOfLoss: 0,
      ranking: ranking,
      eloScore: user.eloScore,
    };

    const matchesList = await this.getUserMatches(userNickname);
    for (let i = 0; i < matchesList.length; i++) {
      if (
        (matchesList[i].playerOneId === user.id && matchesList[i].p1s == 10) ||
        (matchesList[i].playerTwoId === user.id && matchesList[i].p2s == 10)
      )
        stats.numberOfWin++;
    }
    stats.numberOfLoss = matchesList.length - stats.numberOfWin;
    this.setMatchAchievement(user.id, stats.numberOfWin, stats.numberOfLoss);
    return res.status(200).send(stats);
  }

  async getUserMatchHistory(userNickname: string, res: Response) {
    const matchesList = await this.getUserMatches(userNickname);
    const matchHistory: MatchHistory[] = [];
    const currentUser = await this.findOneFromUserNickname(userNickname);
    let opponent: User;
    let matchWon: boolean;
    let score: string;

    try {
      for (let i = 0; i < matchesList.length; i++) {
        if (matchesList[i].playerOneId === currentUser.id) {
          opponent = await this.getUserInfo(matchesList[i].playerTwoId);
          score =
            matchesList[i].p1s.toString() + '-' + matchesList[i].p2s.toString();
          if (matchesList[i].p1s == 10) matchWon = true;
          else matchWon = false;
        } else {
          opponent = await this.getUserInfo(matchesList[i].playerOneId);
          score =
            matchesList[i].p2s.toString() + '-' + matchesList[i].p1s.toString();
          if (matchesList[i].p2s == 10) matchWon = true;
          else matchWon = false;
        }
        const imageOpponent = opponent.avatarImg;
        matchHistory.push({
          id: matchesList[i].gameId,
          imageCurrentUser: currentUser.avatarImg,
          imageOpponent: imageOpponent,
          score: score,
          matchWon: matchWon,
        });
      }
      return res.status(200).send(matchHistory);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  async getLeaderboard(res: Response) {
    try {
      const leaderboard = await this.prismaService.user.findMany({
        take: 10,
        orderBy: {
          eloScore: 'desc',
        },
        select: {
          id: true,
          nickname: true,
          avatarImg: true,
          eloScore: true,
        },
      });
      return res.status(200).send(leaderboard);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  async getUserRanking(userNickname: string) {
    let userRank = '';

    const users = await this.prismaService.user.findMany({
      orderBy: {
        eloScore: 'desc',
      },
    });
    for (let i = 0; i < users.length; i++) {
      if (users[i].nickname == userNickname) {
        const rank = i + 1;
        userRank = rank.toString() + '/' + users.length.toString();
        /* Set achievement who is the boss if the user is a leader */
        if (rank === 1) this.setAchievement(users[i].id, 'achievement1');
        return userRank;
      }
    }
    return userRank;
  }
  async updateConnectionStatus(userId: string, connectionStatus: UserStatus) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          status: connectionStatus,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /** Achievement management */
  async getAchievement(nickname: string, res: Response) {
    try {
      const UserAchivements = await this.prismaService.user.findUnique({
        where: {
          nickname: nickname,
        },
        select: {
          achievements: true,
        },
      });
      const achievementList = [];
      for (let i = 0; i < UserAchivements.achievements.length; i++) {
        const achievement = await this.prismaService.achievement.findUnique({
          where: {
            id: UserAchivements.achievements[i].achievementId,
          },
        });
        achievementList.push(achievement);
      }
      return res.status(200).send(achievementList);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  async setAchievement(userId: string, achievementId: string) {
    try {
      const achievement = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          achievements: {
            where: { achievementId: achievementId },
          },
        },
      });
      if (achievement.achievements.length === 0)
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            achievements: {
              create: [{ achievementId: achievementId }],
            },
          },
        });
    } catch (error) {
      console.log(error);
    }
  }

  setMatchAchievement(
    userId: string,
    numberOfWin: number,
    numberOfLoss: number,
  ) {
    if (numberOfWin + numberOfLoss === 10)
      this.setAchievement(userId, 'achievement6');
    if (numberOfLoss === 5) this.setAchievement(userId, 'achievement4');
    if (numberOfWin === 5) this.setAchievement(userId, 'achievement3');
  }

  /** Ban, mute, block management **/

  async addBlockedUser(userId: string, targetId: string) {
    try {
      const blockedUser = await this.prismaService.blockedUser.create({
        data: {
          channelBlockedRequesterId: userId,
          channelBlockedTargetId: targetId,
        },
      });
      return blockedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async removeBlockedUser(userId: string, targetId: string) {
    try {
      const blockedUser = await this.prismaService.blockedUser.delete({
        where: {
          blockedId: {
            channelBlockedRequesterId: userId,
            channelBlockedTargetId: targetId,
          },
        },
      });

      return blockedUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async checkUserIsBlocked(userId: string, targetId: string) {
    try {
      const userIsBlocked = await this.prismaService.blockedUser.findMany({
        where: {
          OR: [
            {
              AND: [
                { channelBlockedRequesterId: userId },
                { channelBlockedTargetId: targetId },
              ],
            },
            {
              AND: [
                { channelBlockedTargetId: targetId },
                { channelBlockedRequesterId: userId },
              ],
            },
          ],
        },
      });
      return userIsBlocked;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async checkCurrentUserBlockedTarget(userId: string, targetId: string) {
    try {
      const userIsBlocked = await this.prismaService.blockedUser.findFirst({
        where: {
          AND: [
            { channelBlockedRequesterId: userId },
            { channelBlockedTargetId: targetId },
          ],
        },
      });
      // console.log(userIsBlocked);
      return userIsBlocked;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /** Channel invitations for the current user */
  async getChannelInvites(userId: string) {
    try {
      const invitesList = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          invites: {
            select: {
              id: true,
            },
          },
        },
      });
      const invites: { id: string }[] = [];
      for (let i = 0; i < invitesList.invites.length; i++) {
        invites.push(invitesList.invites[i]);
      }
      return invites;
    } catch (error) {
      if (error.status === 404) throw new NotFoundException(error);
      else throw new ForbiddenException(error);
    }
  }
}
