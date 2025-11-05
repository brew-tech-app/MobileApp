import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService, AuthCredentials, BusinessDetails } from '../services/auth.service';
import { RootState } from '../store';
import { setUser, setLoading, setError, clearError } from '../store/slices/authSlice';
import Logger from '../utils/logger';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (credentials: AuthCredentials) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      Logger.info('Login process started');
      const user = await authService.login(credentials);
      dispatch(setUser(user));
      Logger.info('Login successful', { userId: user.id });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      Logger.error('Login failed', err);
      dispatch(setError(errorMessage));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      Logger.info('Logout process started');
      await authService.logout();
      dispatch(setUser(null));
      Logger.info('Logout successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      Logger.error('Logout failed', err);
      dispatch(setError(errorMessage));
    }
  }, [dispatch]);

  const verifyPhone = useCallback(async (phone: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      Logger.info('Phone verification started');
      const result = await authService.verifyPhone(phone);
      if (user && result) {
        dispatch(setUser({ ...user, phone }));
      }
      Logger.info('Phone verification successful');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      Logger.error('Phone verification failed', err);
      dispatch(setError(errorMessage));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, user]);

  const updateBusinessDetails = useCallback(async (details: BusinessDetails) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      Logger.info('Business details update started');
      const updatedUser = await authService.updateBusinessDetails(details);
      dispatch(setUser(updatedUser));
      Logger.info('Business details update successful');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      Logger.error('Business details update failed', err);
      dispatch(setError(errorMessage));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user,
    login,
    logout,
    verifyPhone,
    updateBusinessDetails,
    isLoading,
    error,
  };
};