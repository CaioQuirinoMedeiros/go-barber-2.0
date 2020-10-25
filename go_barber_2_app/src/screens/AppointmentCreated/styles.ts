import styled from 'styled-components/native';

import MyButton from '../../components/Button';
import MyText from '../../components/Text';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled(MyText)`
  font-size: 32px;
  color: #f4ede8;
  margin-top: 48px;
  text-align: center;
`;

export const Description = styled(MyText)`
  font-size: 18px;
  color: #999591;
  text-align: center;
  margin-top: 16px;
`;

export const OkButton = styled(MyButton)`
  margin-top: 56px;
  width: 200px;
`;
