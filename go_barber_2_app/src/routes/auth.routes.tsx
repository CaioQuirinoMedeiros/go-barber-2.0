import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';

export type AuthStackParams = {
  Login: undefined;
  SignUp: undefined;
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
  </AuthStack.Navigator>
);

export default AuthRoutes;
