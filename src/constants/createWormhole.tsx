import * as React from 'react';
import axios, { AxiosRequestConfig } from 'axios';

import {
  PromiseCallback,
  WormholeContextConfig,
  WormholeContextValue,
  WormholeSource,
  WormholeOptions,
} from '../@types';

import { Wormhole as BaseWormhole } from '../components';
import { WormholeProps } from '../components/Wormhole';

export type WormholeProviderProps = {
  readonly onError?: (error: Error) => void;
  readonly children?: JSX.Element | readonly JSX.Element[] | string;
};

const globalName = '__WORMHOLE__';

function createProvider(
  Context: React.Context<WormholeContextValue>
) {
  return function WormholeProvider({
    children,
    onError = console.error,
  }: WormholeProviderProps): JSX.Element {
    const cache = React.useMemo<{
      readonly [uri: string]: React.Component | null;
    }>(() => ({}), []);
    const tasks = React.useMemo<{
      readonly [uri: string]: PromiseCallback<React.Component>[];
    }>(() => ({}), []);
    const baseContext = React.useContext(Context);
    const { verify, global, buildRequestForUri } = baseContext;
    const shouldComplete = React.useCallback(
      (uri: string, error?: Error) => {
        const { [uri]: maybeComponent } = cache;
        const { [uri]: callbacks } = tasks;
        Object.assign(tasks, { [uri]: null });
        callbacks.forEach(({ resolve, reject }) => {
          if (!!maybeComponent) {
            return resolve(maybeComponent);
          }
          return reject(
            error || new Error(`[Wormhole]: Failed to allocate for uri "${uri}".`)
          );
        });
      },
      [cache, tasks],
    );
    const shouldCreateComponent = React.useCallback(async (src: string) => {
      const Component = await new Function(
        globalName,
        `${Object.keys(global).map((key) => `var ${key} = ${globalName}.${key};`).join('\n')}; const exports = {}; ${src}; return exports.default;`
      )(global);
      if (typeof Component !== 'function') {
        throw new Error(
          `[Wormhole]: Expected function, encountered ${typeof Component}. Did you forget to mark your Wormhole as a default export?`
        );
      }
      return Component;
    }, [global]);
    const shouldOpen = React.useCallback(async (uri: string) => {
      try {
        const result = await buildRequestForUri({
          url: uri,
          method: 'get',
        });
        const { data } = result;
        if (typeof data !== 'string') {
          throw new Error(`[Wormhole]: Expected string data, encountered ${typeof data}.`);
        }
        if (!await verify(result)) {
          throw new Error(`[Wormhole]: Failed to verify "${uri}".`);
        }
        const Component = await shouldCreateComponent(data);
        Object.assign(cache, { [uri]: Component });
        return shouldComplete(uri);
      } catch (e) {
        Object.assign(cache, { [uri]: null });
        if (typeof e === 'string') {
          return shouldComplete(uri, new Error(e));
        } else if (typeof e.message === 'string') {
          return shouldComplete(uri, new Error(`${e.message}`));
        }
        return shouldComplete(uri, e);
      }
    }, [
      verify,
      shouldCreateComponent,
      cache,
      tasks,
      shouldComplete,
      buildRequestForUri,
    ]);
    const openUri = React.useCallback(
      async (uri: string, callback: PromiseCallback<React.Component>) => {
        const { [uri]: Component } = cache;
        const { reject } = callback;
        if (Component === null) {
          return reject(
            new Error(`[Wormhole]: Component at uri "${uri}" could not be instantiated.`)
          );
        } else if (typeof Component === 'function') {
          return Component;
        }

        const { [uri]: queue } = tasks;
        if (Array.isArray(queue)) {
          return queue.push(callback);
        }

        Object.assign(tasks, { [uri]: [callback] });
        return shouldOpen(uri);
      },
      [cache, tasks, shouldOpen]
    );
    const openString = React.useCallback(async (src: string) => {
      return shouldCreateComponent(src);
    }, [shouldCreateComponent]);
    const open = React.useCallback(
      async (source: WormholeSource, options: WormholeOptions) => {
        const { dangerouslySetInnerJSX } = options;
        if (typeof source === 'string') {
          if (dangerouslySetInnerJSX === true) {
            return openString(source as string);
          }
          throw new Error(
            `[Wormhole]: Attempted to instantiate a Wormhole using a string, but dangerouslySetInnerJSX was not true.`
          );
        } else if (source && typeof source === 'object') {
          const { uri } = source;
          if (typeof uri === 'string') {
            return new Promise<React.Component>(
              (resolve, reject) => openUri(uri, { resolve, reject }),
            );
          }
        }
        throw new Error(`[Wormhole]: Expected valid source, encountered ${typeof source}.`);
      },
      [openUri, openString],
    );
    const value = React.useMemo(
      () => ({ ...baseContext, open, onError }),
      [baseContext, open, onError],
    );
    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }
}

export default function createWormhole({
  buildRequestForUri = (config: AxiosRequestConfig) => axios(config),
  global = {
    require: (moduleId: string) => {
      if (moduleId === 'react') {
        // @ts-ignore
        return require('react');
      } else if (moduleId === 'react-native') {
        // @ts-ignore
        return require('react-native');
      }
      return null;
    },
  },
  verify,
}: WormholeContextConfig) {
  if (typeof verify !== 'function') {
    throw new Error(
      '[Wormhole]: To create a Wormhole, you **must** pass a verify() function.',
    );
  }
  const defaultValue: WormholeContextValue = Object.freeze({
    buildRequestForUri,
    global,
    verify,
    open: () => Promise.reject(
      new Error('[Wormhole]: It looks like you\'ve forgotten to declare a Wormhole Provider.')
    ),
    onError: console.error,
  });
  const Context = React.createContext<WormholeContextValue>(
    defaultValue
  );
  const useWormhole = () => React.useContext(Context);
  const Wormhole = (props: WormholeProps) => (
    <BaseWormhole {...props} useWormhole={useWormhole} />
  );
  return Object.freeze({
    Provider: createProvider(Context),
    Wormhole,
  });
}
