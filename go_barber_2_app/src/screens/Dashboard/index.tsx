import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import alert from '../../utils/alert';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Provider } from './types';
import { AppStackParams } from '../../routes/app.routes';

import {
  Container,
  Header,
  HeaderTitle,
  ProviderAvatar,
  ProviderContainer,
  ProviderInfo,
  ProvidersList,
  ProvidersListTitle,
  UserName,
  ProfileButton,
  ProviderMeta,
  ProviderMetaText,
  ProviderName,
  UserAvatar,
  EmptyMessage,
} from './styles';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const navigation = useNavigation<NavigationProp<AppStackParams>>();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [fetching, setFetching] = useState(false);

  const getProviders = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await api.getProviders();
      setProviders(data);
    } catch {
      alert({ title: 'Erro', message: 'Erro ao buscar lista de provedores' });
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  const handleSelectProvider = useCallback(
    (providerId: string) => {
      navigation.navigate('AppointmentDatePicker', { providerId });
    },
    [navigation]
  );

  return (
    <Container safe statusBarProps={{ backgroundColor: '#28262e' }}>
      <Header>
        <HeaderTitle>
          Bem vindo,
          {'\n'}
          <UserName bold>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={() => navigation.navigate('Profile')}>
          <UserAvatar
            size={56}
            source={{ uri: user.avatar_url || undefined }}
            nome={user.name}
          />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        onRefresh={getProviders}
        refreshing={fetching}
        ListHeaderComponent={
          <ProvidersListTitle bold>Cabelereiros</ProvidersListTitle>
        }
        ListEmptyComponent={
          !fetching ? (
            <EmptyMessage onPress={getProviders}>
              Nenhum prestador encontrado.
              {'\n'}
              Clique aqui para tentar novamente.
            </EmptyMessage>
          ) : undefined
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => {
              handleSelectProvider(provider.id);
            }}
          >
            <ProviderAvatar
              size={72}
              nome={provider.name}
              source={{ uri: provider.avatar_url || undefined }}
            />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <FeatherIcon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <FeatherIcon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
