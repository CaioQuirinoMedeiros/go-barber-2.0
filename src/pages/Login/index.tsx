import React, { FormEvent } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
          <Input placeholder="E-mail" name="email" icon={FiMail} />
          <Input
            placeholder="Senha"
            type="password"
            name="password"
            icon={FiLock}
          />
          <Button type="submit">Entrar</Button>

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
