import Banner from '../section-components/banner';
import backgroundGeneral from "../../img/disco2.png";
import { Link } from 'react-router-dom';


function Home () {
    return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundGeneral})` }}>
        <Banner text="TRANSCENDANCE 🕺"/>
        <div className="flex flex-col h-screen justify-center items-center gap-10">
            <Link to ="/play">
                <div className="bg-blue hover:bg-dark-blue text-white p-4 w-40 h-16 rounded-2xl text-center">
                    <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> PLAY </p>
                </div>
            </Link>
            <Link to ="/chat">
                <div className="bg-blue hover:bg-dark-blue text-white p-4 w-40 h-16 rounded-2xl text-center">
                    <p className="text-xs sm:text-xs md:text-lg lg:text-2xl"> CHAT </p>
                </div>
            </Link>
        </div>
    </div>
    );
}

export default Home