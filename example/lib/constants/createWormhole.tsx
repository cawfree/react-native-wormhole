import * as React from 'react';
import { WormholeContextValue } from '../@types';

import { Wormhole as BaseWormhole } from '../components';

export default function createWormhole<T extends object>({
  global,
}: WormholeContextValue<T>) {
  const defaultValue: WormholeContextValue<T> = Object.freeze({ global });
  const Context = React.createContext<WormholeContextValue<T>>(
    defaultValue
  );
  const Provider = ({ children }) => (
    <Context.Provider value={defaultValue}>
      {children}
    </Context.Provider>
  );
  const useWormhole = () => React.useContext(Context);
  const Wormhole = (props) => (
    <BaseWormhole {...props} useWormhole={useWormhole} />
  );
  return Object.freeze({ Provider, Wormhole });
}
