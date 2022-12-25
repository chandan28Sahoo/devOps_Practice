// import * as amqp from 'amqplib/callback_api';
// import CONFIG from '../config/index';
// // import { RABBIT_MQ_QUEUES } from '../../constant/response';
// class RabbitMq {
//   public channel: any;
//   public isConnected: boolean = false;
//   constructor() {
//     this.startServer();
//   }
//   public async startServer() {
//     await this.connections().then(
//       (res: any) => {
//         console.log('\nRabbit mq started.');
//         this.channel = res;
//         // START ALL THE QUEUES HERE
//         this.channel.prefetch(1);
//         this.isConnected = true;
//         this.assertQueue('USER_SERVICE');
//       },
//       (error: any) => {
//         return error;
//       }
//     );
//   }
//   public async connections() {
//     console.log({ ENV: CONFIG.RABBITMQ_HOST });
//     return new Promise((resolve, reject) => {
//       amqp.connect(CONFIG.RABBITMQ_HOST, (err, conn): any => {
//         if (err) {
//           reject(err);
//         }
//         conn.createChannel((error1, channel) => {
//           if (error1) {
//             reject(error1);
//           }
//           resolve(channel);
//         });
//       });
//     });
//   }
//   /**
//    * Notification service processes,
//    * @param queue
//    */
//   public async assertQueue(queue: string) {
//     console.log('ASSERT QUEUE WORKING HERE', queue);
//     this.channel.assertQueue(queue, { durable: false });
//   }
//   public async consumeNotificationQueue(queue: string) {
//     const record: any = await new Promise((resolve: any, reject: any) => {
//       this.channel.consume(
//         queue,
//         async (msg: any) => {
//           console.log(msg.content.toString());

//           const data = await JSON.parse(msg.content.toString());
//           this.channel.ack(msg);
//           console.log('CONSUME QUEUE WORKING HERE');
//           console.log(data, 'data');
//           if (data) {
//             resolve(data);
//           } else {
//             reject(null);
//           }
//         },
//         { noAck: false }
//       );
//     });
//     return record;
//   }
//   public async createQueue(queue: string, data: any) {
//     console.log('CREATE QUEUE WORKING HERE');
//     console.log(data);

//     if (data != null || data != undefined)
//       await this.channel.sendToQueue(queue, Buffer.from(data));
//     // await this.channel.Close();
//   }
// }
// export default new RabbitMq();

// // uncomment later
