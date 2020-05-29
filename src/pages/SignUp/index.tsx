import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import getToastErrors from '../../utils/getToastErrors';
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
  const { addToast } = useToast();

  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSignUpSubmit = useCallback(
    async (data: SignupDataForm) => {
      formRef.current?.setErrors({});

      try {
        await signUpSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        const toastErrors = getToastErrors(err);
        toastErrors.forEach(toastError => {
          addToast(toastError);
        });
        return;
      }

      try {
        await signUp(data);

        formRef.current?.reset();
        addToast({
          title: `Cadastrado com sucesso!`,
          description:
            'Parabéns, sua conta foi criada, utilize seus dados para fazer login',
          type: 'success',
        });

        history.push('/');
      } catch (err) {
        addToast({
          title: `Erro ao se cadastrar`,
          description: 'Não foi possível criar o usuário, verifique seus dados',
          type: 'error',
        });
      }
    },
    [signUp, addToast, history]
  );

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleSignUpSubmit} ref={formRef}>
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
