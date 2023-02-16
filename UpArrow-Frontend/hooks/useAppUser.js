import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import api from '../apis';
import storage from '../utils/storage';
import axios from 'axios';
import { useEffect } from 'react';

export const useAppUser = () => {
  const router = useRouter();
  const accessToken = storage.get('access_token');
  const { data: userResponse, refetch } = useQuery(
    ['user profile', accessToken || 'ac'],
    () => {
      const accessToken = storage.get('access_token');
      if (accessToken) {
        return api.user.me().catch((err) => {
          if (err.status === 401) return null;
          return err;
        });
      }
      return {};
    }
  );

  const user = userResponse?.user;

  useEffect(() => {
    if (user && (!user?.username || user.username === '')) {
      router.replace('/signup');
      return;
    }
  }, [user]);

  const logout = () => {
    storage.remove('access_token');
    axios.defaults.headers['Authorization'] = '';
    refetch();
    router.replace('/');
  };

  return { user, logout };
};
