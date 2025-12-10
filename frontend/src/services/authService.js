import { api } from '../lib/api_client';

/**
 * Token management utilities
 */
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export const TokenManager = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  
  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },
  
  clear: () => {
    TokenManager.removeToken();
    TokenManager.removeRefreshToken();
    TokenManager.removeUser();
  }
};

/**
 * Enhanced API client with auth token injection
 */
const authApi = {
  async request(path, options = {}) {
    const token = TokenManager.getToken();
    
    return await api.request(path, {
      ...options,
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  },

  get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  },

  post(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  },
};

/**
 * Helper to handle API responses consistently
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    let errorMessage = 'An error occurred';

    // Handle DRF validation errors (e.g., field-specific)
    if (typeof data === 'object') {
      // If dict like {email: ["already exists"], password: ["too short"], ...}
      if (!data.detail && !data.message) {
        errorMessage = Object.values(data)[0][0]; // extract first message
      } 
      else {
        errorMessage = data.detail || data.message;
      }
    }

    throw { status: response.status, message: errorMessage, data };
  }

  return data;
};


/**
 * Authentication Service
 */
const AuthService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await authApi.post('/api/auth/login/', credentials);
      const data = await handleResponse(response);
      
      // Backend returns {access, refresh} tokens
      if (data.access) {
        TokenManager.setToken(data.access);
        if (data.refresh) {
          TokenManager.setRefreshToken(data.refresh);
        }
        
        // Fetch user info after successful login
        try {
          const userResponse = await authApi.get('/api/auth/user/');
          const userData = await handleResponse(userResponse);
          
          if (userData.isAuthenticated && userData.user) {
            TokenManager.setUser(userData.user);
            return {
              token: data.access,
              refresh: data.refresh,
              user: userData.user
            };
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (userData) => {
    try {
      const response = await authApi.post('/api/auth/register/', userData);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    try {
      const response = await authApi.post('/api/auth/logout/', {});
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      TokenManager.clear();
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    try {
      const response = await authApi.get('/api/auth/user/');
      const data = await handleResponse(response);
      
      // Update stored user info if authenticated
      if (data.isAuthenticated && data.user) {
        TokenManager.setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (payload) => {
    try {
      const response = await authApi.post('/api/auth/password_reset/', payload);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  /**
   * Confirm password reset with token
   */
  confirmPasswordReset: async (payload) => {
    try {
      const response = await authApi.post('/api/auth/password_reset/confirm/', payload);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Password reset confirm error:', error);
      throw error;
    }
  },

 /**
 * Activate user account with code
 */
activateAccount: async (payload) => {
  try {
    const response = await authApi.post('/api/auth/activation/', payload);
    const data = await handleResponse(response);
    
    // Backend returns 'token' not 'access' for activation
    // Check for both 'access' and 'token' to handle different responses
    const token = data.access || data.token;
    
    if (token) {
      TokenManager.setToken(token);
      
      // Handle refresh token if provided
      if (data.refresh) {
        TokenManager.setRefreshToken(data.refresh);
      }
      
      // Fetch user info
      try {
        const userResponse = await authApi.get('/api/auth/user/');
        const userData = await handleResponse(userResponse);
        
        if (userData.isAuthenticated && userData.user) {
          TokenManager.setUser(userData.user);
          return {
            token: token,
            user: userData.user,
            status: 'success',
            message: data.message || 'Account activated'
          };
        }
      } catch (err) {
        console.error('Failed to fetch user after activation:', err);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Account activation error:', error);
    throw error;
  }
},

  /**
   * Resend activation code
   */
  resendActivationCode: async (payload) => {
    try {
      const response = await authApi.post('/api/auth/activation/resend/', payload);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Resend activation code error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated (from local storage)
   */
  isAuthenticated: () => {
    return !!TokenManager.getToken();
  },

  /**
   * Get stored user info
   */
  getStoredUser: () => {
    return TokenManager.getUser();
  }
};

export default AuthService;