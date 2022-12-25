import { config } from 'dotenv';
config();

(async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('./api/db/connection');
  await require('./runGRPCServer');
})();
