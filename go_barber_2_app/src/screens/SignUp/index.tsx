import React, { useRef, useCallback, useState } from 'react';
import { Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { object, string } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';

import logo from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Scrollable,
  Title,
  Input,
  Button,
  BackToLogin,
} from './styles';

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
  const navigation = useNavigation<
    StackNavigationProp<AuthStackParams, 'SignUp'>
  >();

  const [fetching, setFetching] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleSignUpSubmit = useCallback(
    async (data: SignupDataForm) => {
      setFetching(true);
      formRef.current?.setErrors({});

      try {
        await signUpSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      try {
        await signUp(data);

        alert({
          title: 'Cadastro realizado com sucesso!',
          message: 'Você já pode fazer login na aplicação',
          buttons: [
            {
              text: 'Ok',
              onPress: handleLogin,
            },
          ],
        });
      } catch (err) {
        alert({
          title: 'Erro ao realiar cadastro',
          message: 'Não foi possível cadastrar o usuário, tente novamente',
        });
      }

      setFetching(false);
    },
    [handleLogin, signUp]
  );

  return (
    <>
      <Container>
        <Scrollable keyboardShouldPersistTaps="handled">
          <Image source={logo} />

          <Title bold>Crie sua conta</Title>

          <Form onSubmit={handleSignUpSubmit} ref={formRef}>
            <Input
              name="name"
              icon="user"
              autoCapitalize="words"
              placeholder="Nome"
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                emailRef.current && emailRef.current.focus();
              }}
            />
            <Input
              name="email"
              icon="mail"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="E-mail"
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current && passwordRef.current.focus();
              }}
              ref={emailRef}
            />
            <Input
              name="password"
              icon="lock"
              secureTextEntry
              placeholder="Senha"
              textContentType="newPassword"
              onSubmitEditing={() => {
                formRef?.current?.submitForm();
              }}
              returnKeyType="send"
              ref={passwordRef}
            />
            <Button
              loading={fetching}
              onPress={() => {
                formRef?.current?.submitForm();
              }}
            >
              Cadastrar
            </Button>
          </Form>
        </Scrollable>
      </Container>
      <BackToLogin icon="arrow-left" onPress={handleLogin}>
        Voltar para logon
      </BackToLogin>
    </>
  );
};

export default SignUp;
