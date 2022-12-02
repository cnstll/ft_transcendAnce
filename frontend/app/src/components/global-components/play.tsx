import React from 'react';
import Navbar from './navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserInfo from '../query-hooks/useUserInfo';
import Game from '../section-components/game/canvas';
import Button from '../section-components/button';
import { socket } from '../global-components/client-socket';
import LoadingSpinner from '../section-components/loading-spinner';

function Play() {
  const user = useUserInfo();
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<string | null>(null);

  useEffect(() => {
    if (user.isError) navigate('/sign-in');});

  useEffect(() => {
    socket.emit('reJoin', { mode: gameMode }, (response: string | null) => {
      setGameMode(response);
    });
  }, []);

  const setMayhem = () => {
    setGameMode('MAYHEM');
  };

  function setClassic(e: React.MouseEvent) {
    e.preventDefault();
    setGameMode('CLASSIC');
  }

    return (
      <>
      {user.isLoading && <LoadingSpinner />}
      {user.isSuccess &&
      (<div>
        <Background background={BackgroundGeneral}>
          <Navbar
            text={<FontAwesomeIcon icon={faHouse} />}
            avatarImg={user.data.avatarImg}
          />
          {gameMode === null && (
            <div className="flex flex-col h-screen justify-center items-center gap-10">
              <div
                onClick={setClassic}
                className="cursor-pointer text-xs sm:text-xs md:text-lg lg:text-2xl"
              >
                <Button>
                  <button> CLASSIC </button>
                </Button>
              </div>
              <div
                onClick={setMayhem}
                className="cursor-pointer text-xs sm:text-xs md:text-lg lg:text-2xl"
              >
                <Button>
                  <button> MAYHEM </button>
                </Button>
              </div>
            </div>
          )}
          {gameMode != null && (
            <Game
              gameMode={gameMode}
              avatarImg={user.data.avatarImg}
              userId={user.data.id}
            />
          )}
        </Background>
      </div>)}
    </>
  );
}
export default React.memo(Play);
