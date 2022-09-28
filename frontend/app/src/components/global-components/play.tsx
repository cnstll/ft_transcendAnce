import Banner from '../section-components/banner';
import BackgroundGeneral from "../../img/disco2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import Background from '../section-components/background';

function Play () {
    return (
    <div>
        <Background background={BackgroundGeneral}>
            <Banner text = < FontAwesomeIcon icon={faHouse} /> />
        </Background>
    </div>
    );
}

export default Play