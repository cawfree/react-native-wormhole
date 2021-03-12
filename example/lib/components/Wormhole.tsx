import * as React from 'react';
import { Text } from 'react-native';
import axios from 'axios';
import { WormholeContextValue } from '../@types';

// and what dependencies? defined by content?
export type WormholeProps<T extends object> = {
  readonly uri: string;
  readonly useWormhole: () => WormholeContextValue<T>;
  readonly renderLoading?: () => JSX.Element;
};

const globalName = '__WORMHOLE__';

export default function Wormhole<T extends object>({
  uri,
  useWormhole,
  renderLoading,
  ...extras
}: WormholeProps<T>): JSX.Element {
  const { global } = useWormhole();
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const data = `
      async function() {
        const { Text } = require('react-native');
        return Text;
      }
      `.trim();
      const nextComponent = await new Function(
        globalName,
        `
// Global Context 
${Object.keys(global).map((key) => `var ${key} = ${globalName}.${key};`).join('\n')}

// User Scripts
return (${data})();
        `,
      )(global);
      setComponent(nextComponent);
    })();
  }, [uri, global, globalName, setComponent]);

  if (Component) {
    return <Component>helloooo</Component>;
    return <Component {...extras} />;
  } else if (typeof renderLoading === 'function') {
    return renderLoading();
  }
  return null;
}
