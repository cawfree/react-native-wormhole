import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary'

import { WormholeContextValue, WormholeSource } from '../@types';
import { useForceUpdate } from '../hooks';

export type WormholeProps<T extends object> = {
  readonly source: WormholeSource;
  readonly useWormhole: () => WormholeContextValue<T>;
  readonly renderLoading?: () => JSX.Element;
  readonly renderError?: (props: { readonly error: Error }) => JSX.Element;
  readonly dangerouslySetInnerJSX?: boolean;
};

export default function Wormhole<T extends object>({
  source,
  useWormhole,
  renderLoading = () => <React.Fragment />,
  renderError = () => <React.Fragment />,
  dangerouslySetInnerJSX = false,
  ...extras
}: WormholeProps<T>): JSX.Element {
  const { open } = useWormhole();
  const { forceUpdate } = useForceUpdate();
  const [Component, setComponent] = React.useState(null);
  const [error, setError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const Component = await open(source, { dangerouslySetInnerJSX });
        return setComponent(() => Component);
      } catch (e) {
        setComponent(() => null);
        setError(e);
        return forceUpdate();
      }
    })();
  }, [open, source, setComponent, forceUpdate, setError, dangerouslySetInnerJSX]);
  const FallbackComponent = React.useCallback((): JSX.Element => {
    return renderError({ error: new Error('[Wormhole]: Failed to render.') });
  }, [renderError]);
  if (typeof Component === 'function') {
    return (
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Component {...extras} />
      </ErrorBoundary>
    );
  } else if (error) {
    return renderError({ error });
  }
  return renderLoading();
}
