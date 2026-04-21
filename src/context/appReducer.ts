import type { Page } from '../types';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface AppState {
  activePage: Page;
  notifications: Notification[];
  playgroundSelectedTool: string;
  playgroundSelectedDataset: string;
  playgroundSelectedFormat: 'csv' | 'pdf';
}

export type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_PLAYGROUND_TOOL'; payload: string }
  | { type: 'SET_PLAYGROUND_DATASET'; payload: string }
  | { type: 'SET_PLAYGROUND_FORMAT'; payload: 'csv' | 'pdf' };

export const initialState: AppState = {
  activePage: 'dashboard',
  notifications: [],
  playgroundSelectedTool: 'syncfusion',
  playgroundSelectedDataset: 'employees',
  playgroundSelectedFormat: 'csv',
};

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, activePage: action.payload };
    case 'ADD_NOTIFICATION': {
      // Måsvingar här fixar "lexical declaration" felet
      const id = `n-${Date.now()}`;
      return { ...state, notifications: [...state.notifications, { ...action.payload, id }] };
    }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'SET_PLAYGROUND_TOOL':
      return { ...state, playgroundSelectedTool: action.payload };
    case 'SET_PLAYGROUND_DATASET':
      return { ...state, playgroundSelectedDataset: action.payload };
    case 'SET_PLAYGROUND_FORMAT':
      return { ...state, playgroundSelectedFormat: action.payload };
    default:
      return state;
  }
}