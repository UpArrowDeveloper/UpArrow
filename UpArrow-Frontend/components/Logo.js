import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";

const LogoBlock = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.width}px;
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
  const width = isMobile ? 72 : 138;
  const height = isMobile ? 72 : 138;
  return (
    <LogoBlock className="logoblock" {...props} width={width} height={height}>
      <Image src={logoUrl} width={width} height={height} objectFit="contain" />
    </LogoBlock>
  );
};

export default Logo;
