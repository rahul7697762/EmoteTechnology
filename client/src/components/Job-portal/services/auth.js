// job-portal/services/auth.js

// NOTE: This service is largely legacy as we move to a unified Redux-based auth with cookies.
// However, it's kept for the Job Portal components that still use it directly.

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return user; 
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setAuthData = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  // Relying on the presence of user data or assuming cookie-based session is valid
  // Stricter check would involve checking for session cookie, but HttpOnly cookies aren't accessible via JS.
  return !!localStorage.getItem('user');
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const checkRole = (allowedRoles) => {
  const userRole = getUserRole();
  return allowedRoles.includes(userRole);
};