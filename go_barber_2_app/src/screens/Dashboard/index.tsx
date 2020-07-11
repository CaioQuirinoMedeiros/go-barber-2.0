import React from 'react';

import { useAuth } from '../../hooks/auth';

import { Container, Button } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Button
        onPress={async () => {
          await signOut();
        }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;