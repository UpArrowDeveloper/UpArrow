import styled from '@emotion/styled';

const UserIconImg = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 999rem;
  object-fit: cover;
`;

const UserIcon = ({ src }) => {
  return <UserIconImg src={src} />;
};

export default UserIcon;
