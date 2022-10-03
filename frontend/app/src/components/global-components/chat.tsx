import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Banner from '../section-components/banner';
import SideBox from '../section-components/side-box';
import CenterBox from '../section-components/center-box';
import ChatBox from '../section-components/chat-box';
import BackgroundGeneral from "../../img/disco2.png";
import DropDownMenu  from '../section-components/drop-down-menu';
import MenuOpen from '../section-components/menu-open';


function ChannelOptions()
{
    return (
        <div>
            <Link to="/">
                <p className="text-center hover:underline ">Leave channel</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline">Change settings</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline">Invite user</p>
            </Link>
            <Link to="/">
                <p className="text-center hover:underline">Ban user</p>
            </Link>
        </div>)
}

function FriendOptions()
{
    return (<div>
                <Link to="/">
                    <p className="text-center hover:underline">Invite to play</p>
                </Link>
                <Link to="/">
                    <p className="text-center hover:underline">Remove from friends</p>
                </Link>
                <Link to="/">
                    <p className="text-center hover:underline">Ban user</p>
                </Link>
        </div>)
}

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
                      <div className="flex">
                        <div className="flex-1">
                          <h1 className="flex justify-center p-5 font-bold">
                              [Channel name]
                          </h1>
                        </div>
                        <div className="p-5 flex justify-center">
                          <DropDownMenu><MenuOpen><ChannelOptions/></MenuOpen></DropDownMenu>
                        </div>
                      </div>
                    </div>
                    <ChatBox/>
                </CenterBox>
                <SideBox>
                  <h1 className="flex justify-center font-bold">
                      FRIENDS
                  </h1>
                  <DropDownMenu><MenuOpen><FriendOptions/></MenuOpen></DropDownMenu>
                </SideBox>
        </div>
    </div>
    );
}

export default Chat
