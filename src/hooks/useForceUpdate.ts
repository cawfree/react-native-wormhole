import * as React from 'react';

export default function useForceUpdate(): {
  readonly forceUpdate: () => void;
} {
  const [, setState] = React.useState(false);
  const forceUpdate = React.useCallback(() => {
    setState(e => !e);
  }, [setState]);
  return { forceUpdate };
}
