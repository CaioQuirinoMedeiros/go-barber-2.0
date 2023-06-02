import * as React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import ImagePicker, { Options } from 'react-native-image-crop-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { useActionSheet } from '@expo/react-native-action-sheet';

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
  const { showActionSheetWithOptions } = useActionSheet();

  const [updatingAvatar, setUpdatingAvatar] = React.useState(false);
  const [updatingProfile, setUpdatingProfile] = React.useState(false);

  const formRef = React.useRef<FormHandles>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const newPasswordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const handleSaveProfile = React.useCallback(async (data: ProfileFormData) => {
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
          is: (val: string) => !!val?.length,
          then: _schema => _schema.required('Campo obrigatório'),
        }),
        password_confirmation: Yup.string()
          .when('old_password', {
            is: (val: string) => !!val?.length,
            then: _schema => _schema.required('Campo obrigatório'),
          })
          .oneOf([Yup.ref('password'), ''], 'Confirmação incorreta'),
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

  const uploadAvatar = React.useCallback(
    async (image: ImageDTO) => {
      try {
        setUpdatingAvatar(true);

        const formData = new FormData();

        const filePaths = image.uri.split('/');
        const filename = filePaths[filePaths.length - 1];

        formData.append('avatar', {
          type: image.type,
          uri: image.uri,
          name: filename,
        });

        const response = await api.updateAvatar(formData);

        updateUser(response.data);
      } catch (err: any) {
        alert({
          title: 'Erro',
          message: 'Houve um erro ao atualizar a foto, tente novamente',
        });
      } finally {
        setUpdatingAvatar(false);
      }
    },
    [updateUser],
  );

  const handleOpenGallery = React.useCallback(async () => {
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
    } catch {
      // falha quando cancela o picker?
    }
  }, [uploadAvatar]);

  const handleCamera = React.useCallback(async () => {
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
    } catch {
      // Falha quando cancela camera?
    }
  }, [uploadAvatar]);

  const handleRemoveAvatar = React.useCallback(async () => {
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

  function handleShowActionsheet() {
    const options = [
      { label: 'Abrir galeria', action: handleOpenGallery },
      { label: 'Tirar uma foto', action: handleCamera },
      { label: 'Cancelar', action: () => undefined },
    ];
    const possuiFoto = !!user?.avatar_url;
    if (possuiFoto) {
      options.unshift({ label: 'Remover foto', action: handleRemoveAvatar });
    }

    showActionSheetWithOptions(
      {
        options: options.map(option => option.label),
        cancelButtonIndex: options.length,
        destructiveButtonIndex: possuiFoto ? 0 : undefined,
      },
      selectedIndex => {
        if (typeof selectedIndex !== 'number') return;

        const selectedOption = options[selectedIndex];
        if (selectedOption?.action) {
          selectedOption.action();
        }
      },
    );
  }

  return (
    <Container scroll>
      <AvatarContainer onPress={handleShowActionsheet}>
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
        }}>
        Confirmar mudanças
      </Button>
    </Container>
  );
};

export default Profile;
