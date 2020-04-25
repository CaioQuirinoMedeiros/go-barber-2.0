import styled from 'styled-components/native';

import { TextProps } from 'react-native';

export interface MyTextProps extends TextProps {
  bold?: boolean;
}

const MyText = styled.Text<MyTextProps>`
  font-family: ${({ bold }) =>
    bold ? 'RobotoSlab-Medium' : 'RobotoSlab-Regular'};
`;

export default MyText;
