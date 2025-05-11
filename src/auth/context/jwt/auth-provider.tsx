'use client';

import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//

import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType } from '../../types';

// ----------------------------------------------------------------------

// NOTE:
// Authentication provider for JWT based authentication
// Handles user authentication state and operations

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
  [Types.FORGOT_PASSWORD]: undefined;
  [Types.RESET_PASSWORD]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  if (action.type === Types.FORGOT_PASSWORD) {
    return state;
  }
  if (action.type === Types.RESET_PASSWORD) {
    return state;
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};


// Initialize Firebase

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);
        const { user } = response.data.data;

        dispatch({
          type: Types.INITIAL,
          payload: { user },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const {data} = await axios.post(endpoints.auth.login, {
      email,
      password,
    },
    );
    console.log(data, 'response');

    const { token, user } = data;
    console.log({ token, user })
    sessionStorage.setItem(STORAGE_KEY, token);
    setSession(token);

    dispatch({
      type: Types.LOGIN,
      payload: { user },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const response = await axios.post(endpoints.auth.register, {
        email,
        password,
        fullName: `${firstName} ${lastName}`,
      });

      const { accessToken, user } = response.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);
      setSession(accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: { user },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await axios.post(endpoints.auth.forgotPassword, {
      email,
    });
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (token: string, password: string) => {
    await axios.post(endpoints.auth.resetPassword, {
      token,
      password,
    });
  }, []);


  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const contextValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [login, logout, register, forgotPassword, resetPassword, state.user, status]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
