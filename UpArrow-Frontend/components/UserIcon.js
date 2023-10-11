import styled from "@emotion/styled";
import Image from "next/image";

const UserIconImg = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 999rem;
  object-fit: cover;
`;

const UserIcon = ({ src = "" }) => {
  return src ? (
    <div style={{ borderRadius: "90px", overflow: "hidden" }}>
      <Image src={src} width="60px" height="60px" objectFit="cover" />
    </div>
  ) : (
    <UserIconImg src="/images/user.png" />
  );
};

export default UserIcon;
