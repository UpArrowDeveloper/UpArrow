import styled from "@emotion/styled";
import Image from "next/image";
import { useMobile } from "../hooks/useMobile";

const UserIconImg = styled.img`
  width: 6rem;
  height: 6rem;
  border-radius: 999rem;
  object-fit: cover;
`;

const UserIcon = ({ src = "" }) => {
  const { isMobile } = useMobile();
  return src ? (
    <div style={{ borderRadius: "90px", overflow: "hidden" }}>
      <Image
        src={src}
        width={isMobile ? "40px" : "60px"}
        height={isMobile ? "40px" : "60px"}
        objectFit="cover"
      />
    </div>
  ) : (
    <UserIconImg src="/images/user.svg" />
  );
};

export default UserIcon;
