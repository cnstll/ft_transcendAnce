import BackgroundGeneral from '../../img/disco2.png';
import { Link, useNavigate } from 'react-router-dom';
import Background from '../section-components/background';
import Button from '../section-components/button';
import { useEffect } from 'react';
import useUserInfo from '../query-hooks/useUserInfo';
import Navbar from './navbar';
import { useChannelsByUserList } from '../query-hooks/useGetChannels';
import { UseQueryResult } from 'react-query';
import { Channel } from './interface';

function Home() {
  const user = useUserInfo();
  const channels: UseQueryResult<Channel[] | undefined> =
    useChannelsByUserList();
  let activeChannel = '';
  if (channels.isSuccess && channels.data && channels.data.length > 0)
    activeChannel = channels.data[0].id;

  const navigate = useNavigate();

  useEffect(() => {
    if (user.isError) navigate('/sign-in');
  });

  if (user.isSuccess)
    return (
      <div>
        <Background background={BackgroundGeneral}>
          <Navbar
            text="TRANSCENDANCE 🕺"
            avatarImg={user.data.avatarImg}
            activeChannel={activeChannel}
          />
          <div className="flex flex-col h-screen justify-center items-center gap-10">
            <Link to="/play">
              <Button>
                <p className="text-xs sm:text-xs md:text-lg lg:text-2xl">
                  {' '}
                  PLAY{' '}
                </p>
              </Button>
            </Link>
            <Link to={`/chat/${activeChannel}`}>
              <Button>
                <p className="text-xs sm:text-xs md:text-lg lg:text-2xl">
                  {' '}
                  CHAT{' '}
                </p>
              </Button>
            </Link>
          </div>
        </Background>
      </div>
    );

  return <></>;
}

export default Home;
