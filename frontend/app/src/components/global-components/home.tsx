import BackgroundGeneral from '../../img/disco2.png';
import { Link, useNavigate } from 'react-router-dom';
import Background from '../section-components/background';
import Button from '../section-components/button';
import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import Navbar from './navbar';

function Home() {
  const user = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess)
    return (
      <div>
        <Background background={BackgroundGeneral}>
          <Navbar text="TRANSCENDANCE 🕺" avatarImg={user.data.avatarImg} />
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

  return <></>;
}

export default Home;
