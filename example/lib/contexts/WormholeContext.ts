import * as React from 'react';

import { WormholeContextValue } from '../@types';

const defaultValue: WormholeContextValue = Object.freeze({});

export default React.createContext<WormholeContextValue>(defaultValue);
