import { load } from 'protobufjs';

export async function loadProtobuf(path: string) {
  return await load(path);
}
