import Server from './common/server';
import routes from './routes';
import CONFIG from './api/config';

const port = CONFIG.RUNNING_PORT;
new Server().router(routes).listen(port);
