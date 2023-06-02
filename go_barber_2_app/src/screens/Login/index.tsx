import * as React from 'react';
import { Image, TextInput } from 'react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
  Screen,
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

function Login() {
  const { signIn } = useAuth();
  const route = useRoute<RouteProp<AuthStackParams, 'Login'>>();
  const navigation =
    useNavigation<StackNavigationProp<AuthStackParams, 'Login'>>();

  const [fetching, setFetching] = React.useState(false);

  const passwordRef = React.useRef<TextInput>(null);
  const formRef = React.useRef<FormHandles>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.email) {
        formRef.current?.setFieldValue('email', route.params?.email);
      }
    }, [route.params?.email]),
  );

  const handleForgotPassword = React.useCallback(() => {
    const formData = formRef.current?.getData() as LoginFormData;
    navigation.navigate('ForgotPassword', { email: formData.email });
  }, [navigation]);

  const handleSignUp = React.useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const handleLoginSubmit = React.useCallback(
    async (data: LoginFormData) => {
      setFetching(true);
      formRef.current?.setErrors({});

      try {
        await loginSchema.validate(data, { abortEarly: false });
      } catch (err: any) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        setFetching(false);
        return;
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
    [signIn],
  );

  return (
    <Screen keyboardOffset safeTop>
      <Scrollable keyboardShouldPersistTaps="handled">
        <Image source={logo} />

        <Title bold>Faça seu logon</Title>

        <Form
          onSubmit={handleLoginSubmit}
          ref={formRef}
          style={{ marginHorizontal: 24 }}
          initialData={{ email: route.params?.email }}>
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
            }}>
            Entrar
          </Button>
        </Form>

        <ForgotPassword onPress={handleForgotPassword}>
          Esqueci minha senha
        </ForgotPassword>

        <CreateAccount icon="log-in" onPress={handleSignUp}>
          Criar conta
        </CreateAccount>
      </Scrollable>
    </Screen>
  );
}

export default Login;
