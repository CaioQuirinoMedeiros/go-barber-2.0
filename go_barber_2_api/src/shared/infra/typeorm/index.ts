import { createConnections, getConnectionOptions } from 'typeorm';

getConnectionOptions().then(connectionOptions => {
  console.log('connectionOptions', connectionOptions);
});

createConnections()
  .then(() => {
    console.log('Conexões com banco de dados estabelecidas');
  })
  .catch(err => {
    console.log('Erro ao conectar', err);
  });
