// import { GrpcObject } from '@grpc/grpc-js/build/src/make-client';
// import { loadSync } from '@grpc/proto-loader';
// import path from 'path';
// import {
//   loadPackageDefinition,
//   Server,
//   ServerCredentials,
// } from '@grpc/grpc-js';
// import CONFIG from './api/config';
// import l from './common/logger';

// const PROTO_PATH = path.join(__dirname, '../proto/college.proto');

// interface ServerDefinition extends GrpcObject {
//   service: any;
// }
// interface ServerPackage extends GrpcObject {
//   [name: string]: ServerDefinition;
// }

// let packageDefinition = loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   arrays: true,
// });

// let collegeProto = loadPackageDefinition(packageDefinition) as ServerPackage;
// const server = new Server();

// server.addService(collegeProto.CollegeService.service, {
//   // CreateCategory:async (call: any, callback: any) => {
//   //   let request: any = call.request;
//   //   console.log('request@@@', request);
//   //   let userResponse = await categoryHelper.addCategory(request);
//   //   console.log(userResponse, 'userResponse getProfile');
//   //   callback(null, userResponse);
//   // },
// });
// const port = CONFIG.GRPC.CONTAINER_PORT_GRPC
//   ? CONFIG.GRPC.CONTAINER_PORT_GRPC
//   : 3002;
// const host = CONFIG.GRPC.CONTAINER_NAME_GRPC
//   ? CONFIG.GRPC.CONTAINER_NAME_GRPC
//   : '0.0.0.0';

// const uri = `${host}:${port}`;
// console.log('College Service GRPC URI -> ', uri);
// server.bindAsync(uri, ServerCredentials.createInsecure(), (error: any) => {
//   console.log(error);
//   if (!error) {
//     l.info(`Server running at http://${host}`);
//     server.start();
//   }
// });
