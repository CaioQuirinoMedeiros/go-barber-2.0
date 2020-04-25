import React, { useRef } from 'react';
import { Image, TextInput } from 'react-native';

import logo from '../../assets/logo.png';

import {
  Container,
  Scrollable,
  Title,
  Input,
  Button,
  ForgotPassword,
  CreateAccount,
} from './styles';

const Login: React.FC = () => {
  const passwordRef = useRef<TextInput>(null);

  function handleForgotPassword(): void {
    console.log('Opa');
  }

  function handleSignUp(): void {
    console.log('Opa');
  }

  return (
    <>
      <Container>
        <Scrollable keyboardShouldPersistTaps="handled">
          <Image source={logo} />

          <Title bold>Faça seu logon</Title>

          <Input
            name="email"
            icon="mail"
            placeholder="E-mail"
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
            onSubmitEditing={handleForgotPassword}
            innerRef={passwordRef}
          />
          <Button>Entrar</Button>

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
