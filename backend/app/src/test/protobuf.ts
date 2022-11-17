// import { Injectable } from '@nestjs/common';
// import { Root } from 'protobufjs';
// import { userpackage } from "../../proto/file";
// import { load} from '@grpc/proto-loader';
// import {load, Root } from 'protobufjs';
import { load } from 'protobufjs';
//
// type GameInfo = userpackage.User;

export async function loadProtobuf(path: string) {
  // let protobuf = require('protobufjs');

  // this.test.lookupType('userpackage.GameInfo');
  // console.log('hi');
  // const protobuf = require('protobufjs');
  return await load(path);
  // protobuf.load(path, function(err, root: Root) {
  //   if (err)
  //   throw err;
  //   console.log('this is root im returning' ,root);
  //   return root;

  //   // this.root = root;
  //   // // var sizeof = require('sizeof');
  //   // var user = root.lookupType('userpackage.GameInfo');
  //   // // console.log(user.verify({title: 'hi'}));
  //   // // console.log(user.verify({nottitle: 'hi'}));
  //   // let payload = {
  //   //   p1y: 1,
  //   //   p2y: 1,
  //   //   bx: 1,
  //   //   by: 1,
  //   //   p1s: 1,
  //   //   p2s: 1,
  //   // }
  //   // // console.log(sizeof.sizeof(payload, true));
  //   // let message = user.create(
  //   //   payload
  //   // )
  //   // let encoded = user.encode(message).finish();
  //   // console.log(encoded);
  //   // console.log(encoded.length);
  //   // console.log(user.decode(encoded));
  //   // console.log(user.verify( 'hi'));
  // });
}

// protobuf = require('protobufjs');
// @Injectable()
// export class ProtoService {

//   protobuf = require('protobufjs');
//   private root: Root = new Root;
//   // root: Root;
//   //= this.protobuf.load('./proto/file.proto', function( err, root ) {
//   //   if (err)
//   //       throw err;

//   //   return root;
//   // });
//   // test: Root;
//   // user = load("./proto/file.proto" );
//   // run().catch(err => console.log(err));
//   constructor() {
//     // private
//   }

//   encode(message: string) {
//       var user = this.root.lookupType('userpackage.GameInfo');
//   }

//   async run() {
//     // let protobuf = require('protobufjs');

//     // this.test.lookupType('userpackage.GameInfo');
//     this.protobuf.load("./proto/file.proto", function(err, root: Root) {
//       if (err)
//       throw err;

//       this.root = root;
//       // var sizeof = require('sizeof');
//       var user = root.lookupType('userpackage.GameInfo');
//       // console.log(user.verify({title: 'hi'}));
//       // console.log(user.verify({nottitle: 'hi'}));
//       let payload = {
//         p1y: 1,
//         p2y: 1,
//         bx: 1,
//         by: 1,
//         p1s: 1,
//         p2s: 1,
//       }
//       // console.log(sizeof.sizeof(payload, true));
//       let message = user.create(
//         payload
//       )
//       let encoded = user.encode(message).finish();
//       console.log(encoded);
//       console.log(encoded.length);
//       console.log(user.decode(encoded));
//       // console.log(user.verify( 'hi'));
//     });

//   }

// }
