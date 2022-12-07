import BackgroundGeneral from '../../img/disco2.png';
import { Link } from 'react-router-dom';
import Background from '../section-components/background';
import Button from '../section-components/button';
// import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import Navbar from './navbar';
import LoadingSpinner from '../section-components/loading-spinner';
import ErrorMessage from '../section-components/error-message';

function Home() {
  const user = useUserInfo();

  return (
    <div>
      <Background background={BackgroundGeneral}>
        {user.isSuccess && user.data && (
          <Navbar text="TRANSCENDANCE 🕺" avatarImg={user.data.avatarImg} />
        )}
        {user.isLoading && <LoadingSpinner />}
        {user.isError && <ErrorMessage />}
        <div className="flex flex-col h-screen justify-center items-center gap-10">
          <Link to="/play">
            <Button>
              <p className="text-xs sm:text-xs md:text-lg lg:text-2xl">
                {' '}
                PLAY{' '}
              </p>
            </Button>
          </Link>
          <Link to="/chat">
            <Button>
              <p className="text-xs sm:text-xs md:text-lg lg:text-2xl">
                {' '}
                CHAT{' '}
              </p>
            </Button>
          </Link>
        </div>
      </Background>
    </div>
  );
}

export default Home;
