import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import localhost from 'react-native-localhost';
import { PORT } from '@env';
import interopRequireDefault from '@babel/runtime/helpers/interopRequireDefault';
import interopRequireWildcard from '@babel/runtime/helpers/interopRequireWildcard';


import { createWormhole } from './lib';

// @ts-ignore
const modules = require.getModules();

const { Wormhole, Provider } = createWormhole({ global: {
  React,
  require: (id: string) => {
    if (id === 'react-native') {
      return require('react-native');
    } else if (id === 'react') {
      return require('react');
    } else if (id === '@babel/runtime/helpers/interopRequireWildcard') {
      return interopRequireWildcard;
    } else if (id === '@babel/runtime/helpers/interopRequireDefault') {
      return interopRequireDefault;
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
