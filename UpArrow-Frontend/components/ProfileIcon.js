import styled from '@emotion/styled';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { EmptyAvatar } from './icons';

const ProfileIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .menu {
    position: absolute;
    bottom: -20rem;
    right: 0.2rem;
    width: 20rem;
    background-color: white;
    border-radius: 0.6rem;
    box-shadow: 0.5rem 0.5rem 0.8rem 0.5rem rgba(0, 0, 0, 0.28);
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  a {
    padding: 1.6rem;
    cursor: pointer;
  }

  .profile-icon {
    width: 6rem;
    height: 6rem;
    border: 1px solid black;
    border-radius: 9999rem;

    &.no-border {
      border: none;
    }
  }
`;

const InvisibleCover = styled.div`
  background-color: rgba(0 0 0 / 10%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; //viewportwidth
  height: 100vh; //viewportheight
  z-index: 990;
`;

const ProfileIcon = ({ className, data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const profileImageUrl = data?.profile_image_url;
  const isLogin = !!data;

  const navigateProfile = () => {
    router.push('/investor');
  };

  return (
    <>
      <ProfileIconWrapper className={className}>
        {isLogin ? (
          <img
            className='profile-icon'
            src={profileImageUrl}
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <div className='profile-icon no-border'>
            <EmptyAvatar onClick={() => setIsOpen(!isOpen)} />
          </div>
        )}

        {isOpen && (
          <div className='menu'>
            {isLogin ? (
              <>
                <a onClick={() => navigateProfile()}>My Portfolio</a>
                <a>Share Ideas</a>
                <a href='/api/auth/logout'>Logout</a>
              </>
            ) : (
              <a href='/api/auth/login'>Login</a>
            )}
          </div>
        )}
      </ProfileIconWrapper>
      {isOpen && <InvisibleCover onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default ProfileIcon;
