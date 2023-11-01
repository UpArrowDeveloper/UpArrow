import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useMobile } from "../hooks/useMobile";

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

const Logo = ({ logoUrl, ...props }) => {
  const { isMobile } = useMobile();
  return (
    <LogoBlock>
      <Image
        src={logoUrl}
        width={isMobile ? 72 : 138}
        height={isMobile ? 72 : 138}
        {...props}
        objectFit="contain"
      />
    </LogoBlock>
  );
};

export default Logo;
