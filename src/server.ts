import express from 'express';
import 'reflect-metadata';

import routes from './routes';
import './database';

const app = express();

app.use(express.json());
app.use(routes);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
