import React from 'react';
import { createWormhole } from 'react-native-wormhole';
import localhost from 'react-native-localhost';
import { ethers } from 'ethers';

import { SIGNER_ADDRESS, PORT } from '@env';

import type { AxiosResponse } from 'axios';

const { Provider, Wormhole } = createWormhole({
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
    <Provider>
      <Wormhole
        source={{ uri: `http://${localhost}:${PORT}/__mocks__/Mock_1.jsx` }}
        renderError={({ error }) => console.error(error) || null}
      />
    </Provider>
  );
}
