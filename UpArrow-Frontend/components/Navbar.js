import { useRouter } from 'next/router';
import React from 'react';
import styled from '@emotion/styled';
import ProfileIcon from './ProfileIcon';
import { UpArrowLogo } from './icons';
import { HeadH6Bold } from '../styles/typography';
import { useAppUser } from '../hooks/useAppUser';

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
    border: 0.1rem solid gray;
    cursor: pointer;
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

  /* @media screen and (max-width: 60rem) {
    font-size: 1rem;

    .uparrow-logo {
      margin-left: 1rem;
      margin-right: 1rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .stocks {
      margin-right: 1rem;
      cursor: pointer;
    }

    .ideas {
      margin-right: 1rem;
      cursor: pointer;
    }
  } */
`;

const getFirstCharacterCapitalString = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

const Navbar = ({ stockRef, ideaRef, investorRef }) => {
  const router = useRouter();
  const { user } = useAppUser();

  const isAdmin = user?.isAdmin;

  const goToIndex = () => {
    router.push('/');
  };

  const routes = ['stock', 'ideas', 'investors', 'principles'];

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
            <div key={route} onClick={() => router.push(`/${route}`)}>
              {getFirstCharacterCapitalString(route)}
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
        <ProfileIcon data={user} />
      </div>
    </NavBlock>
  );
};

export default Navbar;
