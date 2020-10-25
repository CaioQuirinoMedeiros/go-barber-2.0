import React, { useRef, useCallback, useState } from 'react';
import { Image, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';

import logo from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import api from '../../services/api';
import { AuthStackParams } from '../../routes/auth.routes';

import { Container, Scrollable, Title, Input, Button, Login } from './styles';

const forgotPasswordSchema = object().shape({
  email: string()
    .required('Digite o seu e-mail de login')
    .email('Esse e-mail parece não ser válido'),
});

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const route = useRoute<RouteProp<AuthStackParams, 'ForgotPassword'>>();
  const navigation = useNavigation<
    StackNavigationProp<AuthStackParams, 'ForgotPassword'>
  >();

  const [sending, setFetching] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleForgotPasswordSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setFetching(true);
      formRef.current?.setErrors({});

      try {
        await forgotPasswordSchema.validate(data, { abortEarly: false });
      } catch (err) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
      }

      try {
        await api.forgotPassword(data.email);
        alert({
          title: 'E-mail de recuperação enviado',
          message:
            'Confira a sua caixa de mensagem e siga as instruções para resetar a sua senha.\n\nCaso não encontre o e-mail, verifique a caixa de spam.',
          buttons: [{ text: 'Voltar para o login', onPress: handleLogin }],
        });
      } catch {
        alert({
          title: 'Erro ao recuperar senha',
          message: 'Verifique o e-mail digitado',
        });
      }
      setFetching(false);
    },
    [handleLogin]
  );

  return (
    <Container>
      <Scrollable keyboardShouldPersistTaps="handled">
        <Image source={logo} />

        <Title bold>Recuperar senha</Title>

        <Form
          onSubmit={handleForgotPasswordSubmit}
          ref={formRef}
          initialData={{ email: route.params.email }}
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
            loading={sending}
            onPress={() => {
              formRef.current?.submitForm();
            }}
          >
            Enviar
          </Button>
        </Form>

        <Login onPress={handleLogin}>Fazer login</Login>
      </Scrollable>
    </Container>
  );
};

export default ForgotPassword;
