import React, { useRef, useCallback } from 'react';
import { Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';

import logo from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  Scrollable,
  Title,
  Input,
  Button,
  ForgotPassword,
  CreateAccount,
} from './styles';

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
  const navigation = useNavigation();

  const passwordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  function handleForgotPassword(): void {
    console.log('Opa');
  }

  function handleSignUp(): void {
    navigation.navigate('SignUp');
  }

  const handleLoginSubmit = useCallback(async (data: LoginFormData) => {
    formRef.current?.setErrors({});

    try {
      await loginSchema.validate(data, { abortEarly: false });
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);
    }

    console.log({ data });
  }, []);

  return (
    <>
      <Container>
        <Scrollable keyboardShouldPersistTaps="handled">
          <Image source={logo} />

          <Title bold>Faça seu logon</Title>

          <Form onSubmit={handleLoginSubmit} ref={formRef}>
            <Input
              name="email"
              icon="mail"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current && passwordRef.current.focus();
              }}
            />
            <Input
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
              returnKeyType="send"
              ref={passwordRef}
            />
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
          </Form>

          <ForgotPassword onPress={handleForgotPassword}>
            Esqueci minha senha
          </ForgotPassword>
        </Scrollable>
      </Container>
      <CreateAccount icon="log-in" onPress={handleSignUp}>
        Criar conta
      </CreateAccount>
    </>
  );
};

export default Login;
