import UsersListItem from './users-list-item';
import {
  channelRole,
  channelType,
  User,
  UserListType,
} from '../global-components/interface';
import {
  useGetBlockedUsers,
  useGetUsersWhoBlocked,
} from '../query-hooks/useBlockedUser';
import LoadingSpinner from './loading-spinner';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

interface UsersListProps {
  users: User[];
  userListType: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
  roles?: {
    userId: string;
    role: channelRole;
  }[];
  channelId?: string;
}

function UsersList({
  users,
  userListType,
  type,
  setActiveChannelId,
  roles,
  channelId,
}: UsersListProps) {
  const usersBlocked = useGetBlockedUsers();
  const usersWhoBlocked = useGetUsersWhoBlocked();
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.invalidateQueries('blockedUsersList');
    void queryClient.invalidateQueries('usersWhoBlockedList');
  }, [channelId, setActiveChannelId, userListType]);

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
                type={type}
                setActiveChannelId={setActiveChannelId}
                usersBlocked={usersBlocked.data}
                usersWhoBlocked={usersWhoBlocked.data}
                role={
                  channelId
                    ? roles?.find((role) => role.userId === user.id)
                    : undefined
                }
                channelId={channelId}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default UsersList;
