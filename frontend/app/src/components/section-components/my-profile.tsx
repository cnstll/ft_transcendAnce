import SideBox from './side-box'
import useUser from '../customed-hooks/queries/useUser'
import getUserNickname from '../customed-hooks/queries/getUserNickname'
import UploadPicture from './upload-picture'
import Avatar from './avatar'
import { UserData } from '../global-components/interface'

function UserInfo({ avatarImg, nickName }: UserData) {
  return (
    <>
      <div className="flex justify-center">
        <img
          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
          src={avatarImg}
          alt="Rounded avatar"
        />
      </div>
      <Avatar userNickname={nickName} />
    </>
  );
}

function MyProfile() {
  const user = useUser();
  const nickName = getUserNickname();

  return <>
    {
      <SideBox>
        <UserInfo
          nickName={nickName.data}
          avatarImg={user.data.avatarImg}
        />
        <div className="flex flex-col flex-wrap gap-2 lg:gap-6 mt-2 lg:mt-20 text-[10px] sm:text-xs md:text-sm lg:text-base">
          <UploadPicture />
          <div className="flex justify-start hover:underline cursor-pointer break-all">
            <p>Two factor identification</p>
          </div>
        </div>
      </SideBox>
    }
  </>
}

export default MyProfile;
