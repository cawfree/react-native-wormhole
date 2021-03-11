import React from 'react';
import { StyleSheet, View } from 'react-native';
import localhost from 'react-native-localhost';
import { PORT } from '@env';

import Wormholes, { Wormhole } from './lib';

export default function App() {
  return (
    <Wormholes>
      <View style={styles.container}>
        <Wormhole uri={`http://${localhost}:${PORT}`} />
      </View>
    </Wormholes>
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
