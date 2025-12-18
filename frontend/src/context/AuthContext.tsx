import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
  user: { id: number; email: string } | null;
  login: (token: string, user: { id: number; email: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

