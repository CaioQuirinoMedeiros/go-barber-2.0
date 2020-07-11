import { createConnections } from 'typeorm';

createConnections()
  .then(() => {
    console.log('Conexões com banco de dados estabelecidas');
  })
  .catch(err => {
    console.log('Erro ao conectar', err);
  });
