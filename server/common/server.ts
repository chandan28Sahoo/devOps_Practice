import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import l from './logger';
import CONFIG from '../api/config';
// import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';
import errorHandler from '../api/middlewares/error.handler';
import helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
// import * as swaggerDocument from '../swagger.json';

const app = express();
app.use(helmet());
app.get('/users/status', (_req: any, res: any) => {
  console.log('status sucess');
  //return res.send(JSON.stringify({ status: 'Success' }));
  return res.status(200).json({status:"Success"});
});
// app.use(
//   '/v1/user/swagger',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument)
// );

// Sentry.init({
//   dsn: `${CONFIG.SENTRY_DSN}`,
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Tracing.Integrations.Express({ app }),
//   ],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.use(bodyParser.json({ limit: CONFIG.API.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: CONFIG.API.REQUEST_LIMIT || '100kb',
      })
    );

    // let corsOptions ={}
    const corsOptions = {
      origin: function (origin: any, callback: any) {
        console.log(origin);
        if (CONFIG.WHITE_LIST_DOMAINS.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('You are not allowed to access this domain'));
        }
      },
    };
    // app.use(cors(corsOptions));
    app.use(cors());
    app.use(bodyParser.text({ limit: CONFIG.API.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(CONFIG.SESSION.SECRET));
    app.use(express.static(`${root}/public`));

    const apiSpec = path.join(__dirname, 'api.yml');
    app.use(CONFIG.API.SPEC || '/spec', express.static(apiSpec));
    // app.use(Sentry.Handlers.requestHandler());
    // // TracingHandler creates a trace for every incoming request
    // app.use(Sentry.Handlers.tracingHandler());
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        // eslint-disable-next-line prettier/prettier
        `up and running in ${
          CONFIG.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
