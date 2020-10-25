import styled from 'styled-components/native';

import MyAvatar from '../../components/Avatar';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyScreen from '../../components/Screen';

export const Container = styled(MyScreen).attrs({
  contentContainerStyle: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
})`
  padding: 0 30px;
`;

export const Avatar = styled(MyAvatar)`
  align-self: center;
  margin: 24px 0;
`;

export const Input = styled(MyInput)`
  margin-bottom: 8px;
`;

export const Button = styled(MyButton)`
  margin: 24px 0;
`;
