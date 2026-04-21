import { createContext, type Dispatch } from 'react';
import type { AppState, Action, Notification } from './appReducer';
import type { Page } from '../types';

export interface AppContextType {
  state: AppState;
  navigate: (page: Page) => void;
  notify: (message: string, type: Notification['type']) => void;
  dismissNotification: (id: string) => void;
  dispatch: Dispatch<Action>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);