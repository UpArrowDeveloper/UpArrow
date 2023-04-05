import { useRouter } from 'next/router';
import React from 'react';
import styled from '@emotion/styled';
import ProfileIcon from './ProfileIcon';
import { UpArrowLogo } from './icons';
import { HeadH6Bold } from '../styles/typography';
import { useAppUser } from '../hooks/useAppUser';

const getFirstCharacterCapitalString = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAppUser();

  const isAdmin = user?.isAdmin;

  const goToIndex = () => {
    router.push('/');
  };

  const routes = [
    { name: 'stocks', path: 'stock' },
    { name: 'ideas', path: 'idea' },
    { name: 'investors', path: 'investor' },
    // { name: 'principles', path: 'principles' },
  ];

  const goToAdminPage = () => {
    router.push('/admin');
  };

  return (
    <NavBlock>
      <div className='left-items'>
        <div className='uparrow-logo' onClick={goToIndex}>
          <UpArrowLogo />
        </div>

        <div className='buttons'>
          {routes.map((route) => (
            <div key={route.path} onClick={() => router.push(`/${route.path}`)}>
              {getFirstCharacterCapitalString(route.name)}
            </div>
          ))}
        </div>
      </div>

      <div>
        {isAdmin ? (
          <button className='admin-button' onClick={goToAdminPage}>
            Switch to Admin mode
          </button>
        ) : null}
      </div>

      <div className='right-items'>
        <ProfileIcon data={user} logout={logout} />
      </div>
      {router.asPath !== '/signup' && user && !user?.username && (
        <div className='cover'></div>
      )}
    </NavBlock>
  );
};

export const navbarHeight = '7.8rem';
const NavBlock = styled.div`
  display: flex;
  background-color: white;
  color: black;
  font-size: 2.1rem;
  font-weight: 900;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0rem 0rem 0.7rem #c4c7cc;
  padding: 1.3rem 3.2rem;
  height: ${navbarHeight};

  .left-items {
    display: flex;
    align-items: center;
  }

  .uparrow-logo {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.9rem 2.4rem;
    margin-right: 2.4rem;
  }

  .buttons {
    display: flex;
    ${HeadH6Bold}
    cursor: pointer;
    & > div {
      padding: 2rem 2.4rem;
    }
  }

  .right-items {
    display: flex;
    align-items: center;
  }

  .profile-icon {
    width: 5rem;
    height: 5rem;
    cursor: pointer;
    object-fit: cover;
  }

  .user-profile-picture {
    width: 5rem;
    height: 5rem;
    border-radius: 999rem;
    cursor: pointer;
  }

  .admin-button {
    border-radius: 2rem;
    font-size: 1.4rem;
    font-weight: bold;
    padding: 1.2rem;
    background-color: white;
    border: white;
    :hover {
      background-color: rgba(0 0 0 / 10%);
    }

    .profile-menu {
      width: 40rem;
      height: 70rem;
      display: none;
      background-color: red;
    }
  }

  .cover {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    z-index: 1000;
  }
`;

export default Navbar;
