import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import localhost from 'react-native-localhost';
import { PORT, SIGNER_ADDRESS } from '@env';
import interopRequireDefault from '@babel/runtime/helpers/interopRequireDefault';
import interopRequireWildcard from '@babel/runtime/helpers/interopRequireWildcard';
import { ethers } from 'ethers';

import { createWormhole } from './lib';
import { AxiosResponse } from 'axios';

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
        <Wormhole source={{ uri: `http://${localhost}:${PORT}/hello` }} />
        <Wormhole source={'var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");Object.defineProperty(exports,"__esModule",{value:true});exports.default=ExamplePlugin;var React=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _jsxFileName="/Users/cawfree/Development/react-native-wormhole/example/fixtures/Hello.jsx";function ExamplePlugin(){return React.createElement(_reactNative.Text,{__self:this,__source:{fileName:_jsxFileName,lineNumber:5,columnNumber:10}},"I am a string!");}'} />
        <Wormhole
          source={{ uri: `http://${localhost}:${PORT}/hello2` }}
          renderError={({ error }) => <Text>{`${error.message}`}</Text>}
        />
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
