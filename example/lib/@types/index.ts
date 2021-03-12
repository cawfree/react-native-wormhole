import { AxiosResponse } from 'axios';

export type WormholeSource = {
  readonly uri: string;
};

export type WormholeOptions = {
  readonly dangerouslySetInnerJSX: boolean;
};

export type PromiseCallback<T> = {
  readonly resolve: (result: T) => void;
  readonly reject: (error: Error) => void;
};

export type WormholeContextConfig<T extends object> = {
  readonly verify: (response: AxiosResponse<string>) => Promise<boolean>;
  readonly global: T;
};

export type WormholeContextValue<T extends object> = WormholeContextConfig<T> & {
  readonly open: (
    uri: WormholeSource,
    options: WormholeOptions,
  ) => Promise<React.Component>;
};
