import styled from 'styled-components/native';

import MyScreen from '../../components/Screen';
import MyText from '../../components/Text';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyTextButton from '../../components/TextButton';

export const Screen = styled(MyScreen)``;

export const Scrollable = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    flexGrow: 1,
    paddingTop: 24,
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

export const BackToLogin = styled(MyTextButton).attrs({
  buttonProps: {
    style: {
      justifyContent: 'center',
      marginTop: 'auto',
      alignSelf: 'stretch',
      backgroundColor: '#312e38',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: '#232129',
    },
  },
})``;
