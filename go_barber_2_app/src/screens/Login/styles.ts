import styled from 'styled-components/native';
import { Platform } from 'react-native';

import MyText from '../../components/Text';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyTextButton from '../../components/TextButton';

export const Container = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : undefined,
  enabled: true,
})`
  flex: 1;
  padding: 0 30px;
`;

export const Scrollable = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
})``;

export const Title = styled(MyText)`
  font-size: 24px;
  color: #f4ede8;
  margin: 64px 0 24px;
`;

export const Input = styled(MyInput)`
  margin-bottom: 8px;
`;

export const Button = styled(MyButton)`
  margin-top: 8px;
  align-self: stretch;
`;

export const ForgotPassword = styled(MyTextButton)`
  margin-top: 24px;
  margin-bottom: 30px;
  font-size: 16px;
`;

export const CreateAccount = styled(MyTextButton).attrs({
  buttonProps: {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      backgroundColor: '#312e38',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: '#232129',
    },
  },
  iconProps: {
    color: '#ff9000',
  },
})`
  color: #ff9000;
`;
