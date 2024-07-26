"use client";
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userModel } from '@/app/models/userModel';

interface AuthState {
  token: string | null;
  user: userModel | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  error: string | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

interface AuthContextProps extends AuthState {
  register: (token: string, role: string) => void;
  login: (token: string, role: string ) => void;
  loginWithDAuth: (code: string) => void;
  logout: () => void;
  // loadUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: null,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('Dispatching action:', action.type, 'with payload:', action.payload);
  switch (action.type) {
    case 'USER_LOADED':
      console.log('USER_LOADED:', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      console.log('LOGIN_SUCCESS/REGISTER_SUCCESS:', action.payload);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
    case 'REGISTER_FAIL':
      console.log('AUTH_ERROR/LOGIN_FAIL/LOGOUT/REGISTER_FAIL:', action.payload);
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  const loadUser = async (token: string) => {
    try {
      console.log('Loading user with token:', token);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User loaded:', res.data);
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const register = (token: string, role: string) => {
    console.log('Registering with token:', token);
    localStorage.setItem('token', token);
    dispatch({ type: 'REGISTER_SUCCESS', payload: { token,role } });
    loadUser(token);
  };

  const login = (token: string, role: string) => {
    console.log('Logging in with token:', token);
    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { token, role } });
    loadUser(token);
  };
  const loginWithDAuth = async (code: string) => {
    try {
      console.log('Logging in with DAuth, code:', code);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dauth/callback?code=${code}`);
      console.log('DAuth login successful:', res.data);
      localStorage.setItem('token', res.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      loadUser(res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error logging in with DAuth:', err.response?.data?.msg || err.message);
      dispatch({ type: 'LOGIN_FAIL', payload: err.response?.data?.msg });
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        loginWithDAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
