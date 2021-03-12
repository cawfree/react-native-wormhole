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
  const { global, verify } = useWormhole();
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await axios({
          url: uri,
          method: 'get',
        });
        if (await verify(response)) {
          const { data } = response;
          const nextComponent = await new Function(
            globalName,
            `${Object.keys(global).map((key) => `var ${key} = ${globalName}.${key};`).join('\n')}; const exports = {}; ${data}; return exports.default;`
          )(global);
          if (typeof nextComponent !== 'function') {
            throw new Error(`Expected function, encountered ${typeof nextComponent}.`);
          }
          return setComponent(() => nextComponent);
        }
        throw new Error(`[Wormhole]: Failed to verify "${uri}".`);
      } catch (e) {
        // TODO: handle somehow
        console.error(e);
      }
    })();
  }, [uri, global, globalName, setComponent, verify]);

  if (Component) {
    return <Component {...extras} />;
  } else if (typeof renderLoading === 'function') {
    return renderLoading();
  }
  return null;
}
