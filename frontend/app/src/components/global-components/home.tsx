import Banner from '../section-components/banner';
import BackgroundGeneral from "../../img/disco2.png";
import { Link } from 'react-router-dom';
import Background from '../section-components/background';
import Button from '../section-components/button';

function Home() {
  return (
    <div>
      <Background background={BackgroundGeneral}>
        <Banner text="TRANSCENDANCE 🕺" />
                <div className="flex flex-col h-screen justify-center items-center gap-10">
                    <Link to ="/play">
                        <Button>
                            <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> PLAY </p>
                        </Button>
                    </Link>
                    <Link to ="/chat">
                        <Button>
                            <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> CHAT </p>
                        </Button>
                    </Link>
                </div>
            </Background>
        </div>
    );
}

export default Home