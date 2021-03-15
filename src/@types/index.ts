import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';

export type PromiseCallback<T> = {
  readonly resolve: (result: T) => void;
  readonly reject: (error: Error) => void;
};

export type WormholeSource = {
  readonly uri: string;
} | string;

export type WormholeComponentCache = {
  readonly [uri: string]: React.Component | null;
};

export type WormholeTasks = {
  readonly [uri: string]: PromiseCallback<React.Component>[];
};

export type WormholeOptions = {
  readonly dangerouslySetInnerJSX: boolean;
};

export type WormholeContextConfig = {
  readonly verify: (response: AxiosResponse<string>) => Promise<boolean>;
  readonly buildRequestForUri?: (config: AxiosRequestConfig) => AxiosPromise<string>;
  readonly global?: any;
};
