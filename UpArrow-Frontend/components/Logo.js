import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

const LogoBlock = styled.img`
  width: 13.8rem;
  height: 13.8rem;
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 999rem;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }
`;

const Logo = ({ stockJSON }) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const checkAuthentication = () => {
    if (user) {
      router.push(`/stock/${stockJSON.ticker}`);
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <LogoBlock
      src={stockJSON.profile_image_url}
      onClick={() => checkAuthentication()}
    />
  );
};

export default Logo;
