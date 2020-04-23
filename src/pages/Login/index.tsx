import React, { FormEvent } from 'react';
import { FiLogIn } from 'react-icons/fi';

import logo from '../../assets/logo.svg';

import { Container, Content, Background } from './styles';

const Login: React.FC = () => {
  function handleLoginSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
  }

  return (
    <Container>
      <Content>
        <img src={logo} alt="go barber logo" />
        <form onSubmit={handleLoginSubmit}>
          <h1>Faça seu logon</h1>
          <input placeholder="E-mail" />
          <input placeholder="Senha" type="password" />
          <button type="submit">Entrar</button>

          <a href="/">Esqueci minha senha</a>
        </form>

        <a href="/">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default Login;
