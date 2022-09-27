import Banner from '../section-components/banner';
import backgroundGeneral from "../../img/disco2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

function Play () {
    return (
    <div className="h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundGeneral})` }}>
        <Banner text = < FontAwesomeIcon icon={faHouse} /> />
    </div>
    );
}

export default Play