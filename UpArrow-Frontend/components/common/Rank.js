import styled from "@emotion/styled";
import React from "react";
import { HeadH6Bold } from "../../styles/typography";
import { Flag } from "../icons";
import { mobileWidth } from "../../styles/responsive";

const RankBlock = styled.div`
  position: absolute;
  right: 1.1rem;
  top: 0;
  width: 3.6rem;
  height: 4.3rem;
  ${HeadH6Bold};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  .rank {
    position: absolute;
    padding-bottom: 0.6rem;
  }

  .flag {
    fill: #3d67ff;
  }

  &.secondary {
    color: black;
    .flag {
      fill: #dedede;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    right: 3.6rem;
  }
`;

const Rank = ({ rank }) => {
  return (
    <RankBlock className={rank > 3 ? "secondary" : ""}>
      <Flag className="flag" width={36} height={43} />
      <div className="rank">{rank}</div>
    </RankBlock>
  );
};

export default Rank;
