import * as React from 'react';
import { WormholeContextValue } from '../@types';

import { WormholeContext } from '../contexts';

export type WormholeProviderProps = {
  readonly children?: JSX.Element | readonly JSX.Element[];
};

// Versioning is unimportant, we just care about the content.
export default function WormholeProvider({
  children,
}: WormholeProviderProps): JSX.Element {
  const value = React.useMemo((): WormholeContextValue => ({

  }), []);
  return (
    <WormholeContext.Provider value={value}>
      {children}
    </WormholeContext.Provider>
  );
}
