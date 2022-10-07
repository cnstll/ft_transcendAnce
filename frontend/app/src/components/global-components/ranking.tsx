import Banner from '../section-components/banner';
import BackgroundGeneral from "../../img/disco2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import Background from '../section-components/background';
import OneBox from '../section-components/one-box';
import { NumericFormat } from 'react-number-format';

interface RankingData {
    id?: number;
    position: number;
    image: string;
    name: string;
    score: number;
}

const rankingExamples: RankingData[] = [
{
    id: 1,
    position: 1,
    image: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    name: "Travis",
    score: 10000,
},
{
    id: 2,
    position: 2,
    image: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
    name: "Daphne",
    score: 9999,
},
{
    id: 3,
    position: 3,
    image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    name: "Bob",
    score: 8000,
},
{
    id: 4,
    position: 4,
    image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    name: "John",
    score: 6000,
}
]

function RankingList ({position, image, name, score}: RankingData) {
    return (
    <div className="flex flex-row gap-5 p-5 text-sm sm:text-base md:text-lg lg:text-xl">
        {position === 1 ?
            <p className="self-center text-5xl">🏆</p>
            : <p className="self-center text-3xl">{position}</p> }
        <img className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full"
            src={image} alt="Rounded avatar"/>
        <p className="self-center">{name}</p>
        <NumericFormat className="self-center" value={score} thousandSeparator=" " displayType="text"/>
    </div>
    );
}

function Ranking () {
    return (
    <div>
        <Background background={BackgroundGeneral}>
            <Banner text = < FontAwesomeIcon icon={faHouse} /> />
            <div className="flex justify-center mt-6 ">
                <OneBox>
                    <h1 className="flex justify-center mt-6 text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">RANKING</h1>
                    <p className="flex justify-end mt-6 px-12 text-lg sm:text-lg md:text-xl lg:text-2xl font-bold">SCORE</p>
                        {rankingExamples.map((rankingExample) => (
                            <RankingList position={rankingExample.position} image={rankingExample.image}
                                name={rankingExample.name} score={rankingExample.score} />
                        ))}
                </OneBox>
            </div>
        </Background>
    </div>
    );
}

export default Ranking