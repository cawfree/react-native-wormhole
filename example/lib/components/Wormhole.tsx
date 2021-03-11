import * as React from 'react';
import { Text } from 'react-native';
import axios from 'axios';

// and what dependencies? defined by content?
export type WormholeProps = {
  readonly uri: string;
  readonly renderLoading?: () => JSX.Element;
};

export default function Wormhole({
  uri,
  renderLoading,
}: WormholeProps): JSX.Element {
  React.useEffect(() => {
    (async () => {
      const { data } = await axios({
        url: uri,
      });
      console.warn(data);
    })();
  }, [uri]);
  return <Text>{uri}</Text>;
}
