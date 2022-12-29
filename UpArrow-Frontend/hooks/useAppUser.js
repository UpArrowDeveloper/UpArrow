import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

export const useAppUser = () => {
  const { user } = useUser();
  const [appUser, setAppUser] = useState();

  const getUser = async () => {
    if (user) {
      const email = user.email;
      const userResponse = await axios.get(
        `http://localhost:4000/api/v1/user/${email}/email`
      );
      setAppUser(userResponse.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user: appUser };
};
