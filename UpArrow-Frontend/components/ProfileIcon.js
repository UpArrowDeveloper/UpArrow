import styled from "@emotion/styled";
import { useState } from "react";
import { useRouter } from "next/router";
import { EmptyAvatar } from "./icons";
import { env } from "../config";
import storage from "../utils/storage";

const InvisibleCover = styled.div`
  background-color: rgba(0 0 0 / 10%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; //viewportwidth
  height: 100vh; //viewportheight
  z-index: 990;
`;

const ProfileIcon = ({ className, data, logout }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const profileImageUrl = data?.profileImageUrl;
  const isLogin = !!data;

  const navigateProfile = () => {
    if (!data) return;
    router.push(`/investor/${data?._id}`);
  };

  const navigateShareIdea = () => {
    if (!data) return;
    router.push(`/editor`);
  };

  const login = () => {
    router.push(`${env.serverUrl}/oauth/auth/google`);
  };

  return (
    <>
      <ProfileIconWrapper className={className}>
        {isLogin ? (
          <img
            className="profile-icon"
            src={profileImageUrl}
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <div className="profile-icon no-border">
            <EmptyAvatar onClick={() => setIsOpen(!isOpen)} />
          </div>
        )}

        {isOpen && (
          <div className="menu" onClick={() => setIsOpen(!isOpen)}>
            {isLogin ? (
              <>
                <a onClick={() => navigateProfile()}>My Portfolio</a>
                <a onClick={() => navigateShareIdea()}>Share Ideas</a>
                <a onClick={logout}>Logout</a>
              </>
            ) : (
              <a onClick={login}>Login</a>
            )}
          </div>
        )}
      </ProfileIconWrapper>
      {isOpen && <InvisibleCover onClick={() => setIsOpen(false)} />}
    </>
  );
};

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
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 9999rem;

    &.no-border {
      border: none;
    }
  }
`;

export default ProfileIcon;
