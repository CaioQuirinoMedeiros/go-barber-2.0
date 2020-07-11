import styled from 'styled-components/native';
import RNIcon from 'react-native-vector-icons/Feather';
import MyText from '../Text';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Text = styled(MyText)`
  color: #f4ede8;
  font-size: 18px;
`;

export const Icon = styled(RNIcon)`
  margin-right: 10px;
`;
