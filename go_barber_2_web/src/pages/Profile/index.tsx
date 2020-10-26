import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { object, string, ref, StringSchema } from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import getToastErrors from '../../utils/getToastErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import api from '../../services/api';
import Avatar from '../../components/Avatar';

const profileSchema = object().shape({
  name: string().required('Nome obrigatório'),
  email: string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  old_password: string().when(
    'password',
    (password: string, schema: StringSchema) =>
      password ? schema.required('Preencha sua senha atual') : schema
  ),
  password: string(),
  password_confirmation: string().oneOf(
    [ref('password'), null],
    'Confirmação incorreta'
  ),
});

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleProfileSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});

      try {
        await profileSchema.validate(data, { abortEarly: false });
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
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        await api.put('profile', formData);
        formRef.current?.clearField('old_password');
        formRef.current?.clearField('password');
        formRef.current?.clearField('password_confirmation');
        addToast({
          title: 'Perfil atualizado!',
          description: 'Seus dados foram atualizados com sucesso',
          type: 'success',
        });
      } catch (err) {
        addToast({
          title: 'Erro ao atualizar perfil',
          description:
            'Verifique se os campos estão preenchidos corretamente e tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast]
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files) {
          const file = e.target.files[0];

          const formData = new FormData();

          formData.append('avatar', file);

          const response = await api.patch('users/avatar', formData);
          updateUser(response.data);
        }

        addToast({ type: 'success', title: 'Avatar atualizado!' });
      } catch {
        addToast({ type: 'error', title: 'Erro ao atualizar avatar' });
      }
    },
    [addToast, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handleProfileSubmit}
          ref={formRef}
          initialData={{ name: user.name, email: user.email }}
        >
          <AvatarInput>
            <Avatar size={186} src={user.avatar_url} name={user.name} />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input placeholder="Nome" name="name" icon={FiUser} />
          <Input placeholder="E-mail" name="email" icon={FiMail} />

          <Input
            containerStyle={{ marginTop: 24 }}
            placeholder="Senha atual"
            type="password"
            name="old_password"
            icon={FiLock}
          />
          <Input
            placeholder="Nova Senha"
            type="password"
            name="password"
            icon={FiLock}
          />
          <Input
            placeholder="Confirmar Senha"
            type="password"
            name="password_confirmation"
            icon={FiLock}
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
