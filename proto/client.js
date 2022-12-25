const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const CONFIG = require('../server/api/config/index');
const GRPC_CONFIG = CONFIG.default;

// Nft Client Connection
// const NFT_PROTO_PATH = path.join(__dirname + '/nft.proto');

// const NftPackageDefinition = protoLoader.loadSync(NFT_PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   arrays: true,
// });
// const NftService = grpc.loadPackageDefinition(NftPackageDefinition).NFTServices;
// const nftClient = new NftService(
//   `${GRPC_CONFIG.NFT.CONTAINER_NAME}:${GRPC_CONFIG.NFT.PORT_NUMBER}`,
//   process.env.GRPC_SSL === 'True'
//     ? grpc.credentials.createSsl()
//     : grpc.credentials.createInsecure()
//   // grpc.credentials.createInsecure()
// );
// console.log(
//   `Nft Client running at ${GRPC_CONFIG.NFT.CONTAINER_NAME}:${GRPC_CONFIG.NFT.PORT_NUMBER}`
// );

// // User Client Connection
const USER_PROTO_PATH = path.join(__dirname + '/student.proto');
const UserPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const StudentService = grpc.loadPackageDefinition(
  UserPackageDefinition
).StudentService;

console.log(
  `Student Client running at ${GRPC_CONFIG.STUDENT.STUDENT_CONTAINER_NAME}:${GRPC_CONFIG.STUDENT.STUDENT_CONTAINER_PORT}`
);
const StudentClient = new StudentService(
  `${GRPC_CONFIG.STUDENT.STUDENT_CONTAINER_NAME}:${GRPC_CONFIG.STUDENT.STUDENT_CONTAINER_PORT}`,
  process.env.GRPC_SSL === 'True'
    ? grpc.credentials.createSsl()  
    : grpc.credentials.createInsecure()
);

module.exports = { StudentClient };
