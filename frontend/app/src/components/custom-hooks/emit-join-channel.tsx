import { Channel, channelType } from '../global-components/interface';
import { socket } from '../global-components/client-socket';

function JoinChannel(channelInfo: Channel) {
  switch (channelInfo.type) {
      case channelType.Public:
        socket.emit('joinRoom', {
          joinInfo: {
            id: channelInfo.id,
            type: channelInfo.type,
          },
        });
        break;
      case channelType.Private:
        socket.emit('joinRoom', {
          joinInfo: {
            id: channelInfo.id,
            type: channelInfo.type,
          },
        });
        break;
      case channelType.Protected:
        socket.emit('joinRoom', {
          joinInfo: {
            id: channelInfo.id,
            type: channelInfo.type,
            passwordHash: channelInfo.passwordHash,
          },
        });
        break;
      default:
      //TODO handle all states of the channelType so we don't need a default case
      break;
    }
}
export default JoinChannel;
