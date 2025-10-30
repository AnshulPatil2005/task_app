import { create } from 'zustand';
import { getStoredAuth, saveAuth, clearAuth as clearStoredAuth } from '../utils/token.js';

const initialAuth = getStoredAuth();

const useAuthStore = create((set) => ({
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: Boolean(initialAuth.token),
  setAuth: ({ token, user }) => {
    saveAuth({ token, user });
    set({ token, user, isAuthenticated: true });
  },
  clearAuth: () => {
    clearStoredAuth();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
