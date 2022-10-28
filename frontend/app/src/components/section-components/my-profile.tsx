import SideBox from './side-box';
import UploadPicture from './upload-picture';
import MyMatchHistory from './my-match-history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { UseOutsideDivClick } from '../custom-hooks/use-outside-click';
import { useState } from 'react';
import NickNameForm from './nickname-form';
import useUserInfo from '../query-hooks/useUserInfo';
import TwoFactorAuthentication from './two-factor-authentication';

function MyProfile() {
  const user = useUserInfo();
  const [showForm, setShowForm] = useState<boolean>(false);

  function showEditNameForm() {
    setShowForm(!showForm);
  }

  function ClickOutsideHandler() {
    setShowForm(false);
  }

  const ref = UseOutsideDivClick(ClickOutsideHandler);
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
            <div>
              <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
                <p> {user.data.nickname}</p>
                <div ref={ref}>
                  <button onClick={showEditNameForm}>
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <div>
                    {showForm && <NickNameForm setShowForm={setShowForm} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2 lg:gap-6 mt-2 lg:mt-20 text-[10px] sm:text-xs md:text-sm lg:text-base">
              <UploadPicture />
              <TwoFactorAuthentication user={user.data} />
            </div>
          </SideBox>
          <MyMatchHistory user={user.data} />
        </>
      )}
      {user.isError && <p>this is an error</p>}
      {user.isLoading && <div> Loading...</div>}
    </>
  );
}

export default MyProfile;
