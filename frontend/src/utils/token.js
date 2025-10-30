const TOKEN_KEY = 'task_manager_token';
const USER_KEY = 'task_manager_user';

export const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  const userRaw = window.localStorage.getItem(USER_KEY);

  return {
    token,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
};

export const saveAuth = ({ token, user }) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};
