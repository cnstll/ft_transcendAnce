// package: userpackage
// file: proto/file.proto

import * as jspb from "google-protobuf";

export class GameInfo extends jspb.Message {
  getP1y(): number;
  setP1y(value: number): void;

  getP2y(): number;
  setP2y(value: number): void;

  getBx(): number;
  setBx(value: number): void;

  getBy(): number;
  setBy(value: number): void;

  getP1s(): number;
  setP1s(value: number): void;

  getP2s(): number;
  setP2s(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameInfo.AsObject;
  static toObject(includeInstance: boolean, msg: GameInfo): GameInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameInfo;
  static deserializeBinaryFromReader(message: GameInfo, reader: jspb.BinaryReader): GameInfo;
}

export namespace GameInfo {
  export type AsObject = {
    p1y: number,
    p2y: number,
    bx: number,
    by: number,
    p1s: number,
    p2s: number,
  }
}

export class PlayerInfo extends jspb.Message {
  getYpos(): number;
  setYpos(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerInfo): PlayerInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerInfo;
  static deserializeBinaryFromReader(message: PlayerInfo, reader: jspb.BinaryReader): PlayerInfo;
}

export namespace PlayerInfo {
  export type AsObject = {
    ypos: number,
  }
}

