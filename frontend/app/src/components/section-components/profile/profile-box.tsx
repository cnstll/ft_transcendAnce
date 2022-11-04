import TheirProfile from './their-profile';
import MyProfile from './my-profile';

import { UseQueryResult } from 'react-query';
import { User } from '../../global-components/interface';

interface UserOptionsProps {
  nickname: string | undefined;
  currentUser: UseQueryResult<User>;
}

function ProfileBox(userProps: UserOptionsProps) {
  return (
    <>
      {userProps.nickname &&
        userProps.currentUser.data?.nickname != userProps.nickname && (
          <TheirProfile nickname={userProps.nickname} />
        )}
      {userProps.currentUser.isSuccess &&
        (!userProps.nickname ||
          userProps.nickname === userProps.currentUser.data.nickname) && (
          <MyProfile user={userProps.currentUser} />
        )}
    </>
  );
}

export default ProfileBox;
