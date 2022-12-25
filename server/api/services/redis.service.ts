// import * as redis from 'redis';
// /**
//  * Redis helper function with following functions implemented
//  * setString() - to store key:value data
//  * getString() - to fetch data against key
//  * deleteKey() - to delete specific key
//  */
// export class RedisHelper {
//   public client: redis.RedisClient;
//   public clientInternal: any;
//   private host: string = process.env.REDIS_HOSTNAME || '127.0.0.1';
//   private port: number = Number(process.env.REDIS_PORT) || 6379;

//   constructor() {
//     this.connectRedis();
//   }

//   /**
//    * Establish redis connection
//    */
//   public async connectRedis() {
//     await this.connect().then(
//       async (redConn: any) => {
//         this.clientInternal = redConn;
//       },
//       (error: any) => {
//         console.log('Redis connected error: ', error);
//       }
//     );
//   }

//   public async connect() {
//     return new Promise((resolve, reject) => {
//       const conn = redis.createClient(this.port, this.host);
//       // this.client.auth(this.auth);
//       conn.on('connect', () => {
//         console.log('Redis Connected');
//         resolve(conn);
//       });
//       conn.on('error', (error: any) => {
//         reject(error);
//       });
//     });
//   }

//   // Set String value for given key
//   // Note expires time will be in seconds
//   public async setString(
//     key: string,
//     value: string,
//     expires = 0,
//     database = ''
//   ) {
//     if (database !== '') {
//       this.clientInternal.select(database);
//     }
//     return new Promise((resolve, reject) => {
//       this.clientInternal.set(key, value, (err: any, reply: any) => {
//         if (err) {
//           return reject(err);
//         }
//         // Add Expire Time if provided
//         if (expires !== 0) {
//           this.clientInternal.expire(key, expires * 60);
//         }
//         resolve(reply);
//       });
//     });
//   }

//   // Get String value for given key
//   public async getString(key: string, database: any = '') {
//     if (database !== '') {
//       this.clientInternal.select(database);
//     }
//     return new Promise((resolve, reject) => {
//       this.clientInternal.get(key, (err: any, reply: any) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(reply);
//       });
//     });
//   }

//   // Delete given key from Radis cache
//   public async deleteKey(key: string, database: any = '') {
//     if (database !== '') {
//       this.clientInternal.select(database);
//     } else {
//       this.clientInternal.select(0);
//     }
//     return new Promise((resolve, reject) => {
//       this.clientInternal.del(key, (err: any, response: any) => {
//         if (response === 1) {
//           resolve(response);
//         } else {
//           if (err !== null) {
//             return reject(err);
//           } else {
//             return resolve(true);
//           }
//         }
//       });
//     });
//   }

//   // Get All KEYS
//   public async getAllKeys(database: any = '') {
//     if (database !== '') {
//       this.clientInternal.select(database);
//     }
//     return new Promise((resolve, reject) => {
//       this.clientInternal.keys('*', (err: any, reply: any) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(reply);
//       });
//     });
//   }
// }
// export default new RedisHelper();
