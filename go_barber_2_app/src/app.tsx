import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Routes from './routes';
import AppProvider from './hooks';

// if (Platform.OS === 'android') {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

export function App() {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#312e38" />
        <AppProvider>
          <Routes />
        </AppProvider>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
