import Banner from '../section-components/banner';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import OneBox from '../section-components/one-box';

function Ranking() {
  return (
    <div>
      <Background background={BackgroundGeneral}>
        <Banner text={<FontAwesomeIcon icon={faHouse} />} />
        <div className="flex justify-center mt-6">
          <OneBox>
            <h1 className="flex justify-center mt-6 text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
              RANKING
            </h1>
            <p className="flex justify-end mt-6 px-12 text-lg sm:text-lg md:text-xl lg:text-2xl font-bold">
              SCORE
            </p>
          </OneBox>
        </div>
      </Background>
    </div>
  );
}

export default Ranking;
