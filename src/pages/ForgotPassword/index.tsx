import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import { useToast } from '../../hooks/toast';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import getToastErrors from '../../utils/getToastErrors';

import { Container, Content, Background } from './styles';
import api from '../../services/api';

const forgorPasswordSchema = object().shape({
  email: string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
});

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const handleLoginSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      formRef.current?.setErrors({});
      setLoading(true);

      try {
        await forgorPasswordSchema.validate(data, { abortEarly: false });
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
        await api.post('/password/forgot', { email: data.email });

        addToast({
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque a sua caixa de entrada',
          type: 'success',
        });
      } catch (err) {
        addToast({
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha',
          type: 'error',
        });
      }
      setLoading(false);
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="go barber logo" />
        <Form onSubmit={handleLoginSubmit} ref={formRef}>
          <h1>Recuperar senha</h1>
          <Input placeholder="E-mail" name="email" icon={FiMail} />

          <Button type="submit" loading={loading}>
            Recuperar
          </Button>
        </Form>

        <Link to="/">
          <FiLogIn />
          Voltar ao login
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
