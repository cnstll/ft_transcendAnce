import UsersListItem from './users-list-item';
import {
  channelRole,
  User,
  UserListType,
} from '../global-components/interface';
import {
  useGetBlockedUsers,
  useGetUsersWhoBlocked,
} from '../query-hooks/useBlockedUser';
import LoadingSpinner from './loading-spinner';
import { useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { channelContext } from '../global-components/chat';

interface UsersListProps {
  users: User[];
  userListType: UserListType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  roles?: {
    userId: string;
    role: channelRole;
  }[];
}

function UsersList({
  users,
  userListType,
  setActiveChannelId,
  roles,
}: UsersListProps) {
  const activeChannelCtx = useContext(channelContext);
  const queryClient = useQueryClient();
  const usersBlocked = useGetBlockedUsers();
  const usersWhoBlocked = useGetUsersWhoBlocked();

  useEffect(() => {
    void queryClient.invalidateQueries('blockedUsersList');
    void queryClient.invalidateQueries('usersWhoBlockedList');
  }, [setActiveChannelId, userListType, queryClient]);

  return (
    <>
      {usersBlocked.isError ||
        (usersWhoBlocked.isError && (
          <p className="text-base text-gray-400">We encountered an error 🤷</p>
        ))}
      {usersBlocked.isLoading ||
        (usersWhoBlocked.isLoading && <LoadingSpinner />)}
      {usersBlocked.isSuccess && usersWhoBlocked.isSuccess && (
        <div className="flex flex-col text-base my-4 gap-4">
          {users
            .sort((a, b) =>
              a.nickname.toLowerCase() >= b.nickname.toLowerCase() ? 1 : -1,
            )
            .map((user: User) => (
              <UsersListItem
                key={user.id}
                user={user}
                userListType={userListType}
                setActiveChannelId={setActiveChannelId}
                usersBlocked={usersBlocked.data}
                usersWhoBlocked={usersWhoBlocked.data}
                role={
                  activeChannelCtx.id
                    ? roles?.find((role) => role.userId === user.id)
                    : undefined
                }
                channelId={activeChannelCtx.id}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default UsersList;
