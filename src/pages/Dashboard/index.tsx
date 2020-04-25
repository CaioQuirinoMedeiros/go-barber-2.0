import React from 'react';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div>
      DASHBOARD
      <button type="button" onClick={signOut}>
        LOGOUT
      </button>
    </div>
  );
};

export default Dashboard;
