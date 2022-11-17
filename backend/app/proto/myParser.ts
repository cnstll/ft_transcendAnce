import {GameInfo} from '../src/proto/file_pb'
const Emitter = require("component-emitter"); // polyfill of Node.js EventEmitter in the browser 


class Encoder {
  /**
   * Encode a packet into a list of strings/buffers
   */
  encode(packet: {
      p1y: number,
      p2y: number,
      bx: number,
      by: number,
      p1s: number,
      p2s: number,
  }) {
    let encoded = new GameInfo;
    encoded.setP1y(packet.p1y);
    encoded.setP2y(packet.p2y);
    encoded.setBx(packet.bx);
    encoded.setBy(packet.by);
    encoded.setP1s(packet.p1s);
    encoded.setP2s(packet.p2s);
    // GameInfo.verify(packet);
    // let message = GameInfo.create(packet);
    return encoded.serializeBinary();

  }
}

class Decoder extends Emitter {
  /**
   * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
   */
  add(chunk: any ) {
  console.log(chunk);
  console.log('hi');
    let gameCoordinates =  GameInfo.deserializeBinary(chunk).toObject();
    this.emit("decoded", gameCoordinates);
  // /**
  //  * Clean up internal buffers
  //  */
  }
  destroy() {}
}

export default {Encoder, Decoder};
// export default De;
// module.exports = { Encoder, Decoder };
