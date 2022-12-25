import zookeeper from 'node-zookeeper-client';

const zkClient = zookeeper.createClient(
  process.env.ZOOKEEPER_HOST || 'localhost:2181'
);

class GlobalConfigProvider {
  configs: any = {};

  constructor() {
    zkClient.connect();
  }

  loadConfig() {
    // console.log("process.env.ZOOKEEPER_PATH: ", process.env.ZOOKEEPER_PATH);
    return new Promise((resolve, reject) => {
      zkClient.once('connected', () => {
        zkClient.getData(
          process.env.ZOOKEEPER_PATH || '/nft/admin-service',
          (err: any, data: any, _: any) => {
            if (err) reject(err);
            if (data) this.configs = JSON.parse(data.toString('utf8'));
            resolve(true);
          }
        );
      });
    });
  }
}

const globalConfig = new GlobalConfigProvider();

export default globalConfig;
