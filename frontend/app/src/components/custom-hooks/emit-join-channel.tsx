import { Channel, channelType } from '../global-components/interface';
import { socket } from '../global-components/client-socket';

function JoinChannel(channelInfo: Channel) {
  switch (channelInfo.type) {
    case channelType.Public:
      socket.emit('joinRoom', {
        joinInfo: {
          id: channelInfo.id,
        },
      });
      break;
    case channelType.Protected:
      socket.emit('joinRoom', {
        joinInfo: {
          id: channelInfo.id,
          passwordHash: channelInfo.passwordHash,
        },
      });
      break;
    default:
      console.log('NOT IMPLEMENTED ATM');
      break;
  }
}
export default JoinChannel;
