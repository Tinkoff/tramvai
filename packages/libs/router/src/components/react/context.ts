import { createContext } from 'react';
import type { Url } from '@tinkoff/url';
import type { AbstractRouter } from '../../router/abstract';
import type { NavigationRoute } from '../../types';

export const RouterContext = createContext<AbstractRouter>(null);
export const RouteContext = createContext<NavigationRoute>(null);
export const UrlContext = createContext<Url>(null);
