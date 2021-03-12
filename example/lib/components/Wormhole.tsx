import * as React from 'react';
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
      const { data } = await axios({
        url: uri,
        method: 'get',
      });
      const src = `
// Global Context 
${Object.keys(global).map((key) => `var ${key} = ${globalName}.${key};`).join('\n')}

const exports = {};
${data}

return exports.default;
      `.trim();
      console.log(src);
      const nextComponent = await new Function(globalName, src)(global);
      setComponent(nextComponent);
    })();
  }, [uri, global, globalName, setComponent]);

  if (Component) {
    return Component;
  } else if (typeof renderLoading === 'function') {
    return renderLoading();
  }
  return null;
}
