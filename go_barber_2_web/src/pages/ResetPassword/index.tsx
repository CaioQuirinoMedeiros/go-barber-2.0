import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string, ref } from 'yup';

import { useToast } from '../../hooks/toast';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import getToastErrors from '../../utils/getToastErrors';

import { Container, Content, Background } from './styles';
import api from '../../services/api';

const resetPasswordSchema = object().shape({
  password: string().required('Senha obrigatória'),
  password_confirmation: string().oneOf(
    [ref('password'), ''],
    'Confirmação incorreta',
  ),
});

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        await resetPasswordSchema.validate(data, { abortEarly: false });
      } catch (err: any) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        const toastErrors = getToastErrors(err);
        toastErrors.forEach(toastError => {
          addToast(toastError);
        });

        return;
      }

      try {
        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('password/reset', {
          password,
          password_confirmation,
          token,
        });

        navigate('/');
        addToast({
          title: 'Senha resetada com sucesso!',
          type: 'success',
        });
      } catch (err) {
        addToast({
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
          type: 'error',
        });
      }
    },
    [addToast, navigate, location],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleLoginSubmit} ref={formRef}>
          <h1>Resetar senha</h1>
          <Input
            placeholder="Nova Senha"
            type="password"
            name="password"
            icon={FiLock}
          />
          <Input
            placeholder="Confirmação de Senha"
            type="password"
            name="password_confirmation"
            icon={FiLock}
          />
          <Button type="submit">Alterar senha</Button>
        </Form>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
