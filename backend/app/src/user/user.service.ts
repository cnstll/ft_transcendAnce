import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
        void this.setAchievement(user.id, 'achievement7').catch();
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
      const user: User | null = await this.prismaService.user.findUnique({
        where: {
          id: userId1,
        },
      });
      if (user) {
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
      }
    } catch (error) {}
    return null;
  }

  async getUserInfo(userId: string): Promise<User | null> {
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

  async findOneFromUserNickname(userNickname: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        nickname: userNickname,
      },
    });
  }

  findOneFromImmutableId(immutableId: string): Promise<User | null> {
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
    const futureFriend: User | null = await this.findOneFromUserNickname(
      futureFriendNickname,
    );
    if (futureFriend) {
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
    }
    return res.status(201).send();
  }

  async updateFriendshipStatus(
    activeUserId: string,
    affectedUserId: string,
    friends: boolean,
    res: Response,
  ) {
    if (friends) {
      await this.addFriend(activeUserId, affectedUserId, res);
    } else {
      await this.deleteFriendship(activeUserId, affectedUserId, res);
    }
  }

  async deleteFriendship(activeUserId: string, target: string, res: Response) {
    const user: User | null = await this.findOneFromUserNickname(target);
    if (user) {
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
        if (result) {
          await this.prismaService.friendship.delete({
            where: {
              friendshipId: {
                addresseeId: result.addresseeId,
                requesterId: result.requesterId,
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
      return res.status(200).send();
    }
  }

  async addFriend(
    activeUserId: string,
    requesterNickname: string,
    res: Response,
  ) {
    const status: FriendshipStatus = 'ACCEPTED';
    const requester: User | null = await this.findOneFromUserNickname(
      requesterNickname,
    );
    if (requester) {
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
    if (friends) {
      let info: {
        id: string;
        nickname: string;
        avatarImg: string | null;
        eloScore: number;
        status: string;
        friendStatus: string | null;
      } | null;
      const friendsList: {
        id: string;
        nickname: string;
        avatarImg: string | null;
        eloScore: number;
        status: string;
        friendStatus: string | null;
      }[] = [];
      for (const friendsAddressee of friends.friendsAddressee) {
        if ((info = await this.getInfo(userId, friendsAddressee.requesterId))) {
          friendsList.push(info);
        }
      }
      return res.status(200).send(friendsList);
    }
  }

  async getFriendStatus(
    userId1: string,
    userId2: string,
  ): Promise<string | null> {
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
      const target: User | null = await this.findOneFromUserNickname(
        targetUserId,
      );
      if (target) {
        const info:
          | {
              id: string;
              nickname: string;
              avatarImg: string | null;
              eloScore: number;
              status: UserStatus;
              friendStatus: string | null;
            }
          | null
          | undefined = await this.getInfo(activeUserId, target.id);
        return res.status(200).send(info);
      }
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
    if (friends) {
      const friendsList: {
        id: string;
        nickname: string;
        avatarImg: string | null;
        eloScore: number;
        status: string;
        friendStatus: string | null;
      }[] = [];
      let info: {
        id: string;
        nickname: string;
        avatarImg: string | null;
        eloScore: number;
        status: string;
        friendStatus: string | null;
      } | null;

      for (const friendsAddressee of friends.friendsAddressee) {
        if ((info = await this.getInfo(userId, friendsAddressee.requesterId))) {
          friendsList.push(info);
        }
      }
      for (const friendsRequester of friends.friendsRequester) {
        if ((info = await this.getInfo(userId, friendsRequester.addresseeId))) {
          friendsList.push(info);
        }
      }
      /* Set achievement social animal */
      if (friendsList.length === 1)
        await this.setAchievement(userId, 'achievement2');
      return res.status(200).send(friendsList);
    }
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
      await this.setAchievement(userId, 'achievement5');
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
    if (matches) {
      const matchesList: Match[] = [];

      for (const match of matches.playerOneMatch) {
        matchesList.push(match);
      }

      for (const match of matches.playerTwoMatch) {
        matchesList.push(match);
      }

      matchesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return matchesList;
    }
    return null;
  }

  async getUserMatchesStats(userNickname: string, res: Response) {
    const user = await this.findOneFromUserNickname(userNickname);
    const ranking = await this.getUserRanking(userNickname);
    if (user && ranking) {
      const stats: Stat = {
        numberOfWin: 0,
        numberOfLoss: 0,
        ranking: ranking,
        eloScore: user.eloScore,
      };

      const matchesList = await this.getUserMatches(userNickname);
      if (matchesList) {
        // for (let i = 0; i < matchesList.length; i++) {
        for (const match of matchesList) {
          if (
            (match.playerOneId === user.id && match.p1s == 10) ||
            (match.playerTwoId === user.id && match.p2s == 10)
          )
            stats.numberOfWin++;
        }
        stats.numberOfLoss = matchesList.length - stats.numberOfWin;
        this.setMatchAchievement(
          user.id,
          stats.numberOfWin,
          stats.numberOfLoss,
        );
        return res.status(200).send(stats);
      }
    }
  }

  async getUserMatchHistory(userNickname: string, res: Response) {
    const matchesList = await this.getUserMatches(userNickname);
    const matchHistory: MatchHistory[] = [];
    const currentUser = await this.findOneFromUserNickname(userNickname);
    let opponent: User | null;
    let matchWon: boolean;
    let score: string;

    if (matchesList && currentUser) {
      try {
        // for (let i = 0; i < matchesList.length; i++) {
        for (const match of matchesList) {
          if (match.playerOneId === currentUser.id) {
            opponent = await this.getUserInfo(match.playerTwoId);
            score = match.p1s.toString() + '-' + match.p2s.toString();
            if (match.p1s == 10) matchWon = true;
            else matchWon = false;
          } else {
            opponent = await this.getUserInfo(match.playerOneId);
            score = match.p2s.toString() + '-' + match.p1s.toString();
            if (match.p2s == 10) matchWon = true;
            else matchWon = false;
          }
          if (opponent) {
            const imageOpponent = opponent.avatarImg;
            matchHistory.push({
              id: match.gameId,
              imageCurrentUser: currentUser.avatarImg,
              imageOpponent: imageOpponent,
              score: score,
              matchWon: matchWon,
            });
          }
        }
        return res.status(200).send(matchHistory);
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }
    }
    return res.status(500).send();
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
        if (rank === 1) await this.setAchievement(users[i].id, 'achievement1');
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
      const userAchivements = await this.prismaService.user.findUnique({
        where: {
          nickname: nickname,
        },
        select: {
          achievements: true,
        },
      });
      // // <<<<<<< Updated upstream
      //       const achievementList: Achievement[] = [];
      //       for (let i = 0; i < userAchivements.achievements.length; i++) {
      //         const achievement = await this.prismaService.achievement.findUnique({
      //           where: {
      //             id: userAchivements.achievements[i].achievementId,
      //           },
      //         });
      //         achievementList.push(achievement);
      // =======
      if (userAchivements) {
        const achievementList: {
          id: string;
          label: string;
          description: string;
          image: string;
        }[] = [];
        // for (let i = 0; i < userAchivements.achievements.length; i++) {
        for (const achievements of userAchivements.achievements) {
          const achievement = await this.prismaService.achievement.findUnique({
            where: {
              id: achievements.achievementId,
            },
          });
          if (achievement) achievementList.push(achievement);
        }
        return res.status(200).send(achievementList);
        // >>>>>>> Stashed changes
      }
      return res.status(500).send();
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
      if (achievement) {
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
      }
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
      void this.setAchievement(userId, 'achievement6');
    if (numberOfLoss === 5) void this.setAchievement(userId, 'achievement4');
    if (numberOfWin === 5) void this.setAchievement(userId, 'achievement3');
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
      if (invitesList) {
        const invites: { id: string }[] = [];
        for (const invitees of invitesList.invites) {
          invites.push(invitees);
        }
        return invites;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
