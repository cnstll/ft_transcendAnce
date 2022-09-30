import Banner from '../section-components/banner';
import BackgroundGeneral from "../../img/disco2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import Background from '../section-components/background';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';

function Profile () {
    return (
    <div>
        <Background background={BackgroundGeneral}>
            <Banner text = < FontAwesomeIcon icon={faHouse} /> />
            <div className="flex flex-row gap-20 px-5 justify-center mt-6 text-white text-3xl">
                <SideBox>
                    <p>Upload a picture</p>
                </SideBox>
                <CenterBox>
                    <h1 className="flex justify-center px-5 py-5">MATCH HISTORY</h1>
                </CenterBox>
                <SideBox>
                    <h1 className="flex justify-center">FRIENDS</h1>
                </SideBox>
            </div>
        </Background>
    </div>
    );
}

export default Profile