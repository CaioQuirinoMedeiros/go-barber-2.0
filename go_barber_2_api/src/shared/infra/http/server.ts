/* eslint-disable import/prefer-default-export */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import morgan from 'morgan';
import 'express-async-errors';
import 'reflect-metadata';
import 'dotenv/config';

import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import path from 'path';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use(
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

export const forgotPasswordTemplate = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'modules',
  'users',
  'views',
  'forgot_password.hbs',
);
