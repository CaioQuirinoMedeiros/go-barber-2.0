import styled from 'styled-components/native';
import { Platform } from 'react-native';

import MyButton from '../../components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
  enabled: true,
})`
  flex: 1;
  padding: 0 30px;
`;

export const Button = styled(MyButton)`
  margin-top: 8px;
`;
