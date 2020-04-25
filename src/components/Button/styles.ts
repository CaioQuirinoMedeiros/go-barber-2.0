import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

import MyText from '../Text';

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  background: #ff9000;
  border-radius: 10px;

  justify-content: center;
  align-items: center;
`;

export const Text = styled(MyText)`
  color: #312e38;
  font-size: 18px;
`;
