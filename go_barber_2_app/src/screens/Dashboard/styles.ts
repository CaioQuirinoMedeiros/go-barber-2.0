import styled from 'styled-components/native';
import { FlatList } from 'react-native';

import MyScreen from '../../components/Screen';
import MyText from '../../components/Text';
import MyButtonContainer from '../../components/ButtonContainer';
import MyAvatar from '../../components/Avatar';

import { Provider } from './types';

export const Container = styled(MyScreen)`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled(MyText)`
  color: #f4ede8;
  font-size: 20px;
  line-height: 28px;
`;

export const UserName = styled(MyText)`
  color: #ff9000;
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled(MyAvatar)``;

export const ProvidersList = styled(FlatList<Provider>).attrs({
  contentContainerStyle: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
})``;

export const ProvidersListTitle = styled(MyText)`
  color: #f4ede8;
  font-size: 24px;
  margin-bottom: 24px;
`;

export const ProviderContainer = styled(MyButtonContainer)`
  margin-bottom: 16px;
`;

export const ProviderAvatar = styled(MyAvatar)``;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled(MyText)`
  font-size: 18px;
  color: #f4ede8;
`;

export const ProviderMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ProviderMetaText = styled(MyText)`
  margin-left: 8px;
  color: #999591;
`;

export const EmptyMessage = styled(MyText)`
  color: #f4ede8;
  font-size: 16px;
  text-align: center;
  opacity: 0.5;
  line-height: 24px;
  margin-top: 8px;
`;
