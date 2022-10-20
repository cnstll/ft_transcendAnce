import SideBox from './side-box'
import useTargetInfo from '../query-hooks/useTargetInfo'
import FriendStatus from './friend-status';
import { UseQueryResult } from 'react-query';
import { UserData } from '../global-components/interface'

interface UserOptionsProps {
  nickname: string | undefined,
}


interface TargetInfo {
  id: string,
  nickname: string,
  avatarImg: string,
  eloScore: string,
  status: string,
  friendStatus: string,
}

interface TargetInfoProps {
  targetInfo: TargetInfo,
}

export enum friendshipStatus {
  REQUSTED,
  ACCEPTED,
  PENDING,
  ADD
}

function UserInfo(targetInfo: TargetInfoProps) {
  return (
    <>
      <div className="flex justify-center">
        <img
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
          src={targetInfo.targetInfo.avatarImg}
          alt="Rounded avatar"
        />
      </div>
      <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
        <p> {targetInfo.targetInfo.nickname}</p>
        <FriendStatus status={targetInfo.targetInfo.friendStatus} nickname={targetInfo.targetInfo.nickname} />
      </div>
    </>
  );
}


function ProfileBox(userProps: UserOptionsProps) {

  const profile: UseQueryResult<TargetInfo> | null = useTargetInfo(userProps.nickname);

  return <>
    {profile.isLoading && <p> is loading</p>}
    {profile.isSuccess &&
      < SideBox >
        <UserInfo
          targetInfo={profile.data}
        />
      </SideBox>
    }
  </>
}

export default ProfileBox;
