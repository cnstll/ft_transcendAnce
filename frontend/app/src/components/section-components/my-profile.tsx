import SideBox from './side-box'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function MyProfile() {

  return <>
    {
      <SideBox>
        <div className="flex justify-center">
          <img
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="Rounded avatar"
          />
        </div>
        <div className="flex justify-center flex-row mt-2 gap-2 lg:gap-6 text-xs sm:text-xs md:text-xl lg:text-2xl font-bold">
          <p>Travis</p>
          <button>
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </div>
        <div className="flex flex-col flex-wrap gap-2 lg:gap-6 mt-2 lg:mt-20 text-[10px] sm:text-xs md:text-sm lg:text-base">
          <div className="flex justify-start hover:underline cursor-pointer">
            <p>Upload a picture</p>
          </div>
          <div className="flex justify-start hover:underline cursor-pointer break-all">
            <p>Two factor identification</p>
          </div>
        </div>
      </SideBox>
    }
  </>
}

export default MyProfile;
