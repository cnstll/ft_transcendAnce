import { Channel, channelType } from '../global-components/interface';
import { socket } from '../section-components/socket';

function JoinChannel(channelInfo: Channel) {
  if (channelInfo.type === channelType.Public) {
    socket.emit('joinRoom', {
      joinInfo: {
        id: channelInfo.id,
      },
    });
  } else if (channelInfo.type === channelType.Protected) {
    socket.emit('joinRoom', {
      joinInfo: {
        id: channelInfo.id,
        passwordHash: channelInfo.passwordHash,
      },
    });
  } else {
    console.log('NOT IMPLEMENTED ATM');
  }
}
export default JoinChannel;
