import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGeneral from '../../img/disco2.png';
import useUserInfo from '../query-hooks/useUserInfo';
import Background from '../section-components/background';
import Navbar from './navbar';

function PageNotFound() {
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess)
  return (
    <div>
      <Background background={backgroundGeneral}>
      <Navbar
        text={<FontAwesomeIcon icon={faHouse} />}
        avatarImg={user.data.avatarImg}
      />
      <div
        className="h-screen bg-cover bg-no-repeat flex justify-center items-center"
      >
        \
        <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          404 🕺 vibe not found
        </h1>
      </div>
      </Background>
    </div>
  );

  return <></>;
}

export default PageNotFound;
