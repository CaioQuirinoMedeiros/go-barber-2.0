/* eslint-disable no-empty */
import React, { useRef, useCallback, useState, useMemo } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import ImagePicker, { Options } from 'react-native-image-crop-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import ActionSheet from 'react-native-actionsheet';

import {
  requestCameraPermission,
  requestGaleriaPermission,
} from '../../utils/permissions';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { UpdateProfileParams } from '../../services/api.types';
import getValidationErrors from '../../utils/getValidationErrors';

import alert from '../../utils/alert';

import {
  Container,
  Avatar,
  Input,
  Button,
  AvatarContainer,
  AvatarIconContainer,
} from './styles';
import { ImageDTO, ProfileFormData } from './types';

const imageCommonOptions: Options = {
  cropping: true,
  width: 240,
  height: 240,
  cropperActiveWidgetColor: '#ff9000',
  cropperToolbarWidgetColor: '#232129',
  cropperStatusBarColor: '#28262e',
  cropperToolbarColor: '#f4ede8',
  cropperToolbarTitle: 'Editar imagem',
  cropperCancelText: 'Cancelar',
  mediaType: 'photo',
  cropperChooseText: 'Selecionar',
  loadingLabelText: 'Processando imagem',
  compressImageQuality: 0.8,
  forceJpg: true,
};

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const actionSheetRef = useRef<ActionSheet>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSaveProfile = useCallback(async (data: ProfileFormData) => {
    try {
      setUpdatingProfile(true);
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

      let updateData = {
        name: data.name,
        email: data.email,
      } as UpdateProfileParams;
      if (data.password) {
        updateData = {
          ...updateData,
          password: data.password,
          old_password: data.old_password,
          password_confirmation: data.password_confirmation,
        };
      }

      await api.updateProfile(updateData);

      alert({ title: 'Perfil atualizado com sucesso!' });
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
    } finally {
      setUpdatingProfile(false);
    }
  }, []);

  const uploadAvatar = useCallback(
    async (image: ImageDTO) => {
      try {
        setUpdatingAvatar(true);
        // eslint-disable-next-line no-undef
        const formData = new FormData();

        const filePaths = image.uri.split('/');

        formData.append('avatar', {
          type: image.type,
          uri: image.uri,
          name: filePaths[filePaths.length - 1],
        });

        const response = await api.updateAvatar(formData);

        updateUser(response.data);
      } catch (err) {
        alert({
          title: 'Erro',
          message: 'Houve um erro ao atualizar a foto, tente novamente',
        });
      } finally {
        setUpdatingAvatar(false);
      }
    },
    [updateUser]
  );

  const handleOpenGallery = useCallback(async () => {
    try {
      const cameraGranted = await requestCameraPermission();
      const galeriaGranted = await requestGaleriaPermission();

      if (cameraGranted !== 'granted' || galeriaGranted !== 'granted') {
        return;
      }

      const image = await ImagePicker.openPicker(imageCommonOptions);

      const imagePaths = image.path.split('/');

      await uploadAvatar({
        uri: image.path,
        type: image.mime,
        name: image.filename || imagePaths[imagePaths.length - 1],
      });
    } catch {}
  }, [uploadAvatar]);

  const handleCamera = useCallback(async () => {
    try {
      const cameraGranted = await requestCameraPermission();

      if (cameraGranted !== 'granted') {
        return;
      }

      const image = await ImagePicker.openCamera({
        ...imageCommonOptions,
        useFrontCamera: true,
      });

      const imagePaths = image.path.split('/');

      await uploadAvatar({
        uri: image.path,
        type: image.mime,
        name: image.filename || imagePaths[imagePaths.length - 1],
      });
    } catch {}
  }, [uploadAvatar]);

  const handleRemoveAvatar = useCallback(async () => {
    try {
      setUpdatingAvatar(true);
      await api.removerAvatar();

      updateUser({ ...user, avatar: null, avatar_url: null });
    } catch (err) {
      alert({
        title: 'Erro',
        message: 'Houve um erro ao tentar remover a foto, tente novamente',
      });
    } finally {
      setUpdatingAvatar(false);
    }
  }, [updateUser, user]);

  const actionSheetOptions = useMemo(() => {
    return [
      { label: 'Abrir galeria', action: handleOpenGallery },
      { label: 'Tirar uma foto', action: handleCamera },
      { label: 'Remover foto', action: handleRemoveAvatar },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      { label: 'Cancelar', action: () => {} },
    ];
  }, [handleCamera, handleOpenGallery, handleRemoveAvatar]);

  return (
    <Container scroll>
      <AvatarContainer
        onPress={() => {
          actionSheetRef.current?.show();
        }}
      >
        <Avatar
          size={186}
          nome={user.name}
          source={{ uri: user.avatar_url || undefined }}
        />
        <AvatarIconContainer>
          {updatingAvatar ? (
            <ActivityIndicator size={20} color="#312E38" />
          ) : (
            <FeatherIcon name="camera" size={20} color="#312E38" />
          )}
        </AvatarIconContainer>
      </AvatarContainer>

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
        loading={updatingProfile}
        enabled={!updatingProfile}
        onPress={() => {
          formRef.current?.submitForm();
        }}
      >
        Confirmar mudanças
      </Button>

      <ActionSheet
        ref={actionSheetRef}
        options={actionSheetOptions.map(option => option.label)}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={index => {
          actionSheetOptions[index].action();
        }}
      />
    </Container>
  );
};

export default Profile;
