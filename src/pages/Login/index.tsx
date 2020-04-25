import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import { useAuth } from '../../hooks/AuthContext';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background } from './styles';

const loginSchema = object().shape({
  email: string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: string().required('Senha obrigatória'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleLoginSubmit = useCallback(
    async (data: LoginFormData) => {
      formRef.current?.setErrors({});

      try {
        await loginSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      try {
        await signIn(data);
      } catch (err) {
        console.log('Opa');
      }
    },
    [signIn]
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleLoginSubmit} ref={formRef}>
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
        </Form>

        <Link to="/signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default Login;
