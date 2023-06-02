/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red'},
});

export default App;
