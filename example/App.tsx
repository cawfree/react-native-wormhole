import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import localhost from 'react-native-localhost';
import { PORT, SIGNER_ADDRESS } from '@env';
import interopRequireDefault from '@babel/runtime/helpers/interopRequireDefault';
import interopRequireWildcard from '@babel/runtime/helpers/interopRequireWildcard';
import { ethers } from 'ethers';

import { createWormhole } from './lib';
import { AxiosResponse } from 'axios';

// @ts-ignore
//const modules = require.getModules();

const { Wormhole, Provider: Wormholes } = createWormhole({
  global: {
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
  },
  verify: async ({ headers, data }: AxiosResponse) => {
    const signature = headers['x-csrf-token'];
    const bytes = ethers.utils.arrayify(signature);
    const hash = ethers.utils.hashMessage(data);
    const address = await ethers.utils.recoverAddress(
      hash,
      bytes
    );
    return address === SIGNER_ADDRESS;
  },
});

export default function App() {
  return (
    <Wormholes>
      <View style={styles.container}>
        <Wormhole uri={`http://localhost:${PORT}/hello`} />
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
