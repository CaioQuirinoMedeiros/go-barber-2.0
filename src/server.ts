import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import routes from './routes';
import './database';
import { tmpFolder } from './config/upload';
import AppError from './errors/AppError';

const app = express();

app.use(express.json());
app.use(routes);
app.use('/files', express.static(tmpFolder));

routes.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .send({ status: 'error', message: error.message });
    }

    console.error(error);

    return response.status(500).send({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
