// import React from 'react'
import Navbar from './navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import WatchGame from '../section-components/game/watch-game';
import useUserInfo from '../query-hooks/useUserInfo';

function Watch() {
  const { playerId } = useParams();
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  }, []);

  if (user.isSuccess)
    return (
      <div>
        <Background background={BackgroundGeneral}>
          <Navbar
            text={<FontAwesomeIcon icon={faHouse} />}
            avatarImg={user.data.avatarImg}
          />
          {playerId != null && (
            <WatchGame userId={playerId} />
          )}
        </Background>
      </div>
    );
  return <p> zut </p>;
}

export default Watch;
