import { useReducer, useCallback, type ReactNode } from 'react';
import { AppContext } from './AppContext';
import { appReducer, initialState, type Notification } from './appReducer';
import type { Page } from '../types';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useCallback((page: Page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    window.scrollTo(0, 0);
  }, []);

  const notify = useCallback((message: string, type: Notification['type']) => {
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const notification: Notification = { id, message, type };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      navigate,
      notify,
      dismissNotification,
      dispatch,
    }}>
      {children}
    </AppContext.Provider>
  );
};
