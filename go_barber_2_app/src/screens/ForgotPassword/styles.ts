import styled from 'styled-components/native';

import MyText from '../../components/Text';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyTextButton from '../../components/TextButton';
import MyScreen from '../../components/Screen';

export const Screen = styled(MyScreen)``;

export const Scrollable = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    flexGrow: 1,
    padding: 24,
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

export const Login = styled(MyTextButton)`
  margin-top: 24px;
  margin-bottom: 30px;
  font-size: 16px;
`;
