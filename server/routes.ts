import { Application } from 'express';
import userRouter from './routes/user.router';

export default function routes(app: Application): void {
  app.use('/users/api/v1', userRouter);
}
