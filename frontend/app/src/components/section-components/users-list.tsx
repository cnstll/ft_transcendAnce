import UsersListItem from './users-list-item';
import type {
  channelType,
  User,
  UserListType,
} from '../global-components/interface';
import { useGetBlockRelations } from '../query-hooks/useBlockedUser';
import LoadingSpinner from './loading-spinner';

interface UsersListProps {
  users: User[];
  userListType: UserListType;
  type?: channelType;
  setActiveChannelId?: React.Dispatch<React.SetStateAction<string>>;
}

function UsersList({
  users,
  userListType,
  type,
  setActiveChannelId,
}: UsersListProps) {
  const usersWithBlockRelation = useGetBlockRelations();

  console.log(usersWithBlockRelation.data);

  return (
    <>
      {usersWithBlockRelation.isError && (
        <p className="text-base text-gray-400">We encountered an error 🤷</p>
      )}
      {usersWithBlockRelation.isLoading && <LoadingSpinner />}
      {usersWithBlockRelation.isSuccess && (
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
                blockRelationUserList={usersWithBlockRelation.data}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default UsersList;
