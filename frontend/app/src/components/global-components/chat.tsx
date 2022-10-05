import Banner from '../section-components/banner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat-box';
import Message from '../section-components/message';
import BackgroundGeneral from "../../img/disco2.png";

function Chat () {
    return (
    <div className="h-screen bg-black">
        <Banner text = < FontAwesomeIcon icon={faHouse} /> />
        <div className="flex flex-row gap-14 px-5 justify-center mt-6 text-white text-xs sm:text-xs md:text-xl lg:text-3xl">
                <SideBox>
                    <div className="flex justify-center flex-row gap-4 font-bold">
                        <h1>CHANNEL</h1>
                        <button>+</button>
                    </div>
                </SideBox>
                <CenterBox>
                    <div className="h-full bg-cover bg-no-repeat border-2 border-purple" style={{ backgroundImage: `url(${BackgroundGeneral})` }}>
                        <h1 className="flex justify-center p-5">
                            [Channel name]
                        </h1>
                        <Message/>
                    </div>
                    <ChatBox/>
                </CenterBox>
                <SideBox>
                    <h1 className="flex justify-center font-bold">
                        FRIENDS
                    </h1>
                </SideBox>
        </div>
    </div>
    );
}

export default Chat