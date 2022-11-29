import { Channel, channelType } from '../global-components/interface';
import { socket } from '../global-components/client-socket';

function JoinChannel(channelInfo: Channel) {
  switch (channelInfo.type) {
    case channelType.Protected:
      socket.emit('joinRoom', {
        joinInfo: {
          id: channelInfo.id,
          type: channelInfo.type,
          passwordHash: channelInfo.passwordHash,
        },
      });
      break;
    case channelType.DirectMessage:
      socket.emit('joinRoom', {
        joinInfo: {
          id: channelInfo.id,
          type: channelInfo.type,
          userId: channelInfo.userId,
        },
      });
      break;
    default:
      socket.emit('joinRoom', {
        joinInfo: {
          id: channelInfo.id,
          type: channelInfo.type,
        },
      });
      break;
  }
}
export default JoinChannel;
