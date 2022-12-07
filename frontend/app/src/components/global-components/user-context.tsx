import React, { createContext, Dispatch, useContext, useState } from 'react';
import {
  useGetBlockedUsers,
  useGetUsersWhoBlocked,
} from '../query-hooks/useBlockedUser';
import useUserInfo from '../query-hooks/useUserInfo';
import ErrorMessage from '../section-components/error-message';
import LoadingSpinner from '../section-components/loading-spinner';
import { User, UserConnectionStatus } from './interface';

export const userInfoContext = createContext({
  user: {
    id: '',
    avatarImg: '',
    nickname: '',
    eloScore: 0,
    status: UserConnectionStatus.OFFLINE,
    twoFactorAuthenticationSet: false,
  } as User,
  usersIblocked: [] as string[],
  usersWhoBlockedMe: [] as string[],
  blocked: false,
  setBlocked: '' as unknown as Dispatch<React.SetStateAction<boolean>>,
});

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const userInfo = useUserInfo();
  const usersIblocked = useGetBlockedUsers();
  const usersWhoBlockedMe = useGetUsersWhoBlocked();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  return (
    <>
      {userInfo.isSuccess &&
        usersIblocked.isSuccess &&
        usersWhoBlockedMe.isSuccess && (
          <userInfoContext.Provider
            value={{
              user: userInfo.data,
              usersIblocked: usersIblocked.data,
              usersWhoBlockedMe: usersWhoBlockedMe.data,
              blocked: isBlocked,
              setBlocked: setIsBlocked,
            }}
          >
            {children}
          </userInfoContext.Provider>
        )}
      {(userInfo.isError ||
        usersIblocked.isError ||
        usersWhoBlockedMe.isError) && <ErrorMessage />}
      {(userInfo.isLoading ||
        usersIblocked.isLoading ||
        usersWhoBlockedMe.isLoading) && <LoadingSpinner />}
    </>
  );
}

export default function UserInfoConsumer() {
  return useContext(userInfoContext);
}
