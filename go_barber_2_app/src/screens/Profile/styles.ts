import styled from 'styled-components/native';

import MyAvatar from '../../components/Avatar';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyButtonContainer from '../../components/ButtonContainer';
import MyScreen from '../../components/Screen';

export const Container = styled(MyScreen).attrs({
  contentContainerStyle: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
})`
  padding: 0 30px;
`;

export const AvatarContainer = styled(MyButtonContainer)`
  align-self: center;
  position: relative;
  margin: 24px 0;
  padding: 0;
  background: transparent;
`;

export const Avatar = styled(MyAvatar)`
  align-self: center;
`;

export const AvatarIconContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 8px;
  height: 50px;
  width: 50px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  background: #ff9000;
`;

export const Input = styled(MyInput)`
  margin-bottom: 8px;
`;

export const Button = styled(MyButton)`
  margin: 24px 0;
`;
