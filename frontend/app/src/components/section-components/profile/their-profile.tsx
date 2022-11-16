import SideBox from '../side-box';
import useTargetInfo from '../../query-hooks/useTargetInfo';
import FriendStatus from '../friend-status';
import { UseQueryResult } from 'react-query';
import { TargetInfo } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

export enum friendshipStatus {
  REQUSTED,
  ACCEPTED,
  PENDING,
  ADD,
}

function TheirProfile({ nickname }: { nickname: string }) {
  const user: UseQueryResult<TargetInfo> | null = useTargetInfo(nickname);

  return (
    <>
      {user.isSuccess && (
        <>
          <SideBox>
            <div className="flex justify-center">
              <img
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                src={user.data.avatarImg}
                alt="Rounded avatar"
              />
            </div>
            <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
              <p>{user.data.nickname}</p>
              <FriendStatus
                status={user.data.friendStatus}
                nickname={user.data.nickname}
              />
            </div>
          </SideBox>
        </>
      )}
      {user.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {user.isLoading && <LoadingSpinner />}
    </>
  );
}

export default TheirProfile;
