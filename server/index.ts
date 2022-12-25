import './common/env';
// import zookeeper from './common/zookeeper';

(async () => {
  // await zookeeper.loadConfig();
  await require('./api/config');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./api/db/connection');
  // await db.initialize();
  await require('./runServer');
})();

// console.log(CONFIG);
