import { createConnections } from 'typeorm';

createConnections([
  {
    name: 'default',
    type: (process.env.TYPEORM_CONNECTION as 'postgres') || 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    logging: true,
    entities: [
      './src/modules/**/infra/typeorm/entities/*.ts',
      './src/modules/**/infra/typeorm/entities/*.js',
    ],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations',
    },
  },
  {
    name: 'mongo',
    type: 'mongodb',
    url: process.env.MONGO_URL,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: ['./src/modules/**/infra/typeorm/schemas/*.ts'],
  },
])
  .then(() => {
    console.log('Conexões com banco de dados estabelecidas');
  })
  .catch(err => {
    console.log('Erro ao conectar', err);
  });
