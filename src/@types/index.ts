import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

export type WormholeSource = {
  readonly uri: string;
} | string;

export type WormholeOptions = {
  readonly dangerouslySetInnerJSX: boolean;
};

export type PromiseCallback<T> = {
  readonly resolve: (result: T) => void;
  readonly reject: (error: Error) => void;
};

export type WormholeContextConfig = {
  readonly verify: (response: AxiosResponse<string>) => Promise<boolean>;
  readonly buildRequestForUri?: (config: AxiosRequestConfig) => AxiosPromise<string>;
  readonly global?: any;
};

export type WormholeContextValue = WormholeContextConfig & {
  readonly open: (
    uri: WormholeSource,
    options: WormholeOptions,
  ) => Promise<React.Component>;
  readonly buildRequestForUri: (config: AxiosRequestConfig) => AxiosPromise<string>;
};
