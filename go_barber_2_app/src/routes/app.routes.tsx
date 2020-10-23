import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import AppointmentDatePicker from '../screens/AppointmentDatePicker';
import AppointmentCreated from '../screens/AppointmentCreated';

export type AppStackParams = {
  Dashboard: undefined;
  AppointmentDatePicker: {
    providerId: string;
  };
  AppointmentCreated: undefined;
  Profile: undefined;
};

const AppStack = createStackNavigator<AppStackParams>();

const AuthRoutes: React.FC = () => (
  <AppStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <AppStack.Screen name="Dashboard" component={Dashboard} />
    <AppStack.Screen
      name="AppointmentDatePicker"
      component={AppointmentDatePicker}
    />
    <AppStack.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <AppStack.Screen name="Profile" component={Profile} />
  </AppStack.Navigator>
);

export default AuthRoutes;
