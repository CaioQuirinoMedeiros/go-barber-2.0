import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import alert from '../../utils/alert';

import { Container, Avatar, Input, Button } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSaveProfile = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          })
          .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      alert({
        title: 'Perfil atualizado com sucesso!',
        message: 'As informações do perfil foram atualizadas.',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      alert({
        title: 'Erro no cadastro',
        message: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
      });
    }
  }, []);

  return (
    <Container scroll>
      <Avatar
        size={186}
        nome={user.name}
        source={{ uri: user.avatar_url || undefined }}
      />

      <View>
        <Form initialData={user} ref={formRef} onSubmit={handleSaveProfile}>
          <Input
            autoCapitalize="words"
            name="name"
            icon="user"
            placeholder="Nome"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              emailInputRef.current?.focus();
            }}
          />

          <Input
            ref={emailInputRef}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            name="email"
            icon="mail"
            placeholder="E-mail"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
          />

          <Input
            style={{ marginTop: 16 }}
            ref={passwordInputRef}
            secureTextEntry
            name="old_password"
            icon="lock"
            placeholder="Senha atual"
            textContentType="newPassword"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              newPasswordInputRef.current?.focus();
            }}
          />

          <Input
            ref={newPasswordInputRef}
            secureTextEntry
            name="password"
            icon="lock"
            placeholder="Nova senha"
            textContentType="newPassword"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              confirmPasswordInputRef.current?.focus();
            }}
          />

          <Input
            ref={confirmPasswordInputRef}
            secureTextEntry
            name="password_confirmation"
            icon="lock"
            placeholder="Confirmar senha"
            textContentType="newPassword"
            returnKeyType="send"
            onSubmitEditing={() => {
              formRef.current?.submitForm();
            }}
          />
        </Form>
      </View>

      <Button
        onPress={() => {
          formRef.current?.submitForm();
        }}
      >
        Confirmar mudanças
      </Button>
    </Container>
  );
};

export default Profile;
