import { AxiosResponse } from 'axios';

export type WormholeContextValue<T extends object> = {
  readonly verify: (response: AxiosResponse<string>) => Promise<boolean>;
  readonly global: T;
};
