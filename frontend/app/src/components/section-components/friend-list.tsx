// import UsersListItem from './users-list-item';
import UsersList from './users-list'
import type { User } from '../global-components/interface';
import axios from "axios";
import { useState, useEffect } from "react";

interface UsersListProps {
  channelUsers: User[];
}

function FriendsList() {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [friendsInfo, setUserInfo] = useState<UsersListProps | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserInfo =
      () => {
        axios
          .get<UsersListProps>(
            'http://localhost:3000/user/get-user-friends',
            { withCredentials: true }
          )
          .then((res) => {
            if (res.status == 200) {
              setUserInfo(res.data);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            setError(true);
            console.log(error);
          });
      }
    fetchUserInfo();
  }, []);

  if (isLoading) {
    return (
      <section>
        <p> is loading... </p>
      </section>
    )
  }
  if (error) {
    return (
      <section>
        <p> I Can't get yo friends :(</p>
      </section>
    )
  }
  return (
    <UsersList channelUsers={friendsInfo} />
  );
}

export default FriendsList;
