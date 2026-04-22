import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';

/**
 * Custom hook för att komma åt Lidstroem HR-context.
 * Kastar ett fel om den används utanför en AppProvider.
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider. Check your main.tsx setup!');
  }
  
  return context;
};