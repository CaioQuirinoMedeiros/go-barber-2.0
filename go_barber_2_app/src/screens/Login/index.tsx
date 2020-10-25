import React, { useRef, useCallback, useState } from 'react';
import { Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';

import logo from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';

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
  const { signIn } = useAuth();
  const navigation = useNavigation<
    StackNavigationProp<AuthStackParams, 'Login'>
  >();

  const [fetching, setFetching] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const handleForgotPassword = useCallback(() => {
    const formData = formRef.current?.getData() as LoginFormData;
    navigation.navigate('ForgotPassword', { email: formData.email });
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleLoginSubmit = useCallback(
    async (data: LoginFormData) => {
      setFetching(true);
      formRef.current?.setErrors({});

      try {
        await loginSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }

      try {
        await signIn(data);
      } catch {
        alert({
          title: 'Erro ao fazer login',
          message: 'Verifique suas credenciais',
        });
      }
      setFetching(false);
    },
    [signIn]
  );

  return (
    <>
      <Container>
        <Scrollable keyboardShouldPersistTaps="handled">
          <Image source={logo} />

          <Title bold>Faça seu logon</Title>

          <Form
            onSubmit={handleLoginSubmit}
            ref={formRef}
            initialData={{
              email: 'caio.quirino.medeiros@gmail.com',
              password: '123456',
            }}
          >
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
              loading={fetching}
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
