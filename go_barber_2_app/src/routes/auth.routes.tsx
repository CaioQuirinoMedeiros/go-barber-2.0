import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';

export type AuthStackParams = {
  Login: {
    email?: string;
  };
  SignUp: undefined;
  ForgotPassword: {
    email?: string;
  };
};

const AuthStack = createStackNavigator<AuthStackParams>();

const AuthRoutes: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </AuthStack.Navigator>
);

export default AuthRoutes;
