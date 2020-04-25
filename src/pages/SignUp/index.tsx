import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import { useAuth } from '../../hooks/AuthContext';
import getValidationErrors from '../../utils/getValidationErrors';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

const signUpSchema = object().shape({
  name: string().required('Nome obrigatório'),
  email: string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: string().min(6, 'No mínimo 6 dígitos'),
});

interface SignupDataForm {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { signUp } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleLoginSubmit = useCallback(
    async (data: SignupDataForm) => {
      formRef.current?.setErrors({});

      try {
        await signUpSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      try {
        await signUp(data);

        formRef.current?.reset();
      } catch (err) {
        console.log({ err });
      }
    },
    [signUp]
  );

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleLoginSubmit} ref={formRef}>
          <h1>Faça seu cadastro</h1>
          <Input placeholder="Nome" name="name" icon={FiUser} />
          <Input placeholder="E-mail" name="email" icon={FiMail} />
          <Input
            placeholder="Senha"
            type="password"
            name="password"
            icon={FiLock}
          />
          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para logon
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
