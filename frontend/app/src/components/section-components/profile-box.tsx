import TheirProfile from './their-profile';
import MyProfile from './my-profile';

interface UserOptionsProps {
  nickname: string | undefined;
}

function ProfileBox(userProps: UserOptionsProps) {
  return (
    <>
      {userProps.nickname && <TheirProfile nickname={userProps.nickname} />}
      {!userProps.nickname && <MyProfile />}
    </>
  );
}

export default ProfileBox;
