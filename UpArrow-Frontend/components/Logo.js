import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";

const LogoBlock = styled.div`
  img {
    border-radius: 999rem;
  }
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  border-radius: 999rem;
  :hover {
    border: 0.1rem solid gray;
    cursor: pointer;
  }
`;

const Logo = ({ logoUrl, isMobile, ...props }) => {
  return (
    <LogoBlock {...props}>
      <Image
        src={logoUrl}
        width={isMobile ? 72 : 138}
        height={isMobile ? 72 : 138}
        objectFit="contain"
      />
    </LogoBlock>
  );
};

export default Logo;
