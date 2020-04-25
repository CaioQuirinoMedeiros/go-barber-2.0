import styled from 'styled-components';
import { shade } from 'polished';

import signupBackground from '../../assets/sing-up-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;

  form {
    margin: 50px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 26px;
    }
  }

  > a {
    color: #f4ede8;
    display: block;
    text-decoration: none;
    transition: color 0.2s;
    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signupBackground}) no-repeat center;
  background-size: cover;
`;
