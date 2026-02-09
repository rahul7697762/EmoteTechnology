// job-portal/services/auth.js
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!userData || !token) return null;
  
  try {
    const user = JSON.parse(userData);
    return { ...user, token };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const checkRole = (allowedRoles) => {
  const userRole = getUserRole();
  return allowedRoles.includes(userRole);
};
// job-portal/services/auth.js
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!userData || !token) return null;
  
  try {
    const user = JSON.parse(userData);
    return { ...user, token };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setAuthData = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const checkRole = (allowedRoles) => {
  const userRole = getUserRole();
  return allowedRoles.includes(userRole);
};