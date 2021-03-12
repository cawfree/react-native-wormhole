import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import localhost from 'react-native-localhost';
import { PORT } from '@env';

import { createWormhole } from './lib';

// @ts-ignore
const modules = require.getModules();

const { Wormhole, Provider } = createWormhole({ global: {
  React,
  require: (id: string) => {
    if (id === 'react-native') {
      return require('react-native');
    }
    return null;
  },
} });

export default function App() {
  return (
    <Provider>
      <View style={styles.container}>
        <Wormhole uri={`http://${localhost}:${PORT}/hello`} />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
