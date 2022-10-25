import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import Game from '../section-components/Canvas';

function Play() {

  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess)
    return (
      <div>
        <Background background={BackgroundGeneral}>
          <Navbar
            text={<FontAwesomeIcon icon={faHouse} />}
            avatarImg={user.data.avatarImg}
          />
          <Game />
        </Background>
      </div>
    );

  return <></>;
}

export default Play;
