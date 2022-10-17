import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { Link } from 'react-router-dom';
import Background from '../section-components/background';
import Button from '../section-components/button';
import { UserData } from './interface';

function Home({ avatarImg }: UserData) {
  return (
    <div>
      <Background background={BackgroundGeneral}>
        <Navbar text="TRANSCENDANCE 🕺" avatarImg={avatarImg} />
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
