import Navbar from '../section-components/navbar';
import BackgroundGeneral from '../../img/disco2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Background from '../section-components/background';
import { UserData } from './interface';

function Play({ avatarImg }: UserData) {
  return (
    <div>
      <Background background={BackgroundGeneral}>
        <Navbar
          text={<FontAwesomeIcon icon={faHouse} />}
          avatarImg={avatarImg}
        />
      </Background>
    </div>
  );
}

export default Play;
