import HomeBanner from '../section-components/home-banner';
import backgroundGeneral from "../../img/disco2.png";
import { Link } from 'react-router-dom';


function Home () {
    return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundGeneral})` }}>
        <HomeBanner />
        <div className="flex flex-col h-screen justify-center items-center gap-10">
            <div className="bg-blue hover:bg-dark-blue text-white py-2 px-4 w-2/12 h-16 rounded-2xl">
                <Link to ="/play">
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> PLAY </p>
                    </div>
                </Link>
            </div>
            <div className="bg-blue hover:bg-dark-blue text-white py-2 px-4 w-2/12 h-16 rounded-2xl">
                <Link to ="/chat">
                    <div className="flex justify-center items-center gap-2">
                        <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> CHAT </p>
                    </div>
                </Link>
            </div>
        </div>
    </div>
    );
}

export default Home