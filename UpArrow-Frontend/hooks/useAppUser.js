import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../apis';

export const useAppUser = () => {
  const { user } = useUser();
  const [appUser, setAppUser] = useState();
  const router = useRouter();

  const getUser = async () => {
    if (user) {
      const email = user.email;
      try {
        const user = await api.user.getByEmail(email)();
        console.log('userResponse : ', user);
        setAppUser(user);
      } catch (error) {
        console.log('no user');
        router.push('/signup');
      }
    }
  };

  const refetch = () => {
    getUser();
  };

  useEffect(() => {
    refetch();
  }, [user]);

  return { user: appUser, refetch };
};
