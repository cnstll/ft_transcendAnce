// package: userpackage
// file: proto/file.proto

import * as jspb from "google-protobuf";

export class User extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    title: string,
  }
}

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

