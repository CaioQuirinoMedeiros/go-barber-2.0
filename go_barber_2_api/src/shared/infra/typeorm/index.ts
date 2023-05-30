import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import User from '@modules/users/infra/typeorm/entities/User';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { createConnections } from 'typeorm';

createConnections([
  {
    type: process.env.TYPEORM_CONNECTION as 'postgres',
    url: process.env.TYPEORM_URL,
    entities: [User, UserToken, Appointment],
  },
  {
    name: 'mongo',
    type: 'mongodb',
    url: process.env.MONGO_URL,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [Notification],
  },
])
  .then(() => {
    console.log('Conexões com banco de dados estabelecidas');
  })
  .catch(err => {
    console.log('Erro ao conectar com banco de dados', err);
  });
