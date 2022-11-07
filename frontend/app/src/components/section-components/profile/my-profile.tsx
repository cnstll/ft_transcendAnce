/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import SideBox from '../side-box';
import UploadPicture from './upload-picture';
import MyMatchHistory from './my-match-history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { UseOutsideDivClick } from '../../custom-hooks/use-outside-click';
import { useState } from 'react';
import NickNameForm from './nickname-form';
import TwoFactorAuthentication from './two-factor-authentication';
import { UseQueryResult } from 'react-query';
import { User } from '../../global-components/interface';
import LoadingSpinner from '../loading-spinner';

function MyProfile(props: { user: UseQueryResult<User> }) {
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
      {props.user.isSuccess && (
        <>
          <SideBox>
            <div className="flex justify-center">
              <img
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
                src={props.user.data.avatarImg}
                alt="Rounded avatar"
              />
            </div>
            <div>
              <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
                <p> {props.user.data.nickname}</p>
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
              <TwoFactorAuthentication user={props.user.data} />
            </div>
          </SideBox>
          <MyMatchHistory user={props.user.data} />
        </>
      )}
      {props.user.isError && <p className='text-base text-gray-400'>We encountered an error 🤷</p>}
      {props.user.isLoading && <LoadingSpinner/>}
    </>
  );
}

export default MyProfile;
