import React from "react";
import styled from "@emotion/styled";
import color from "../styles/color";
import {
  Body12Medium,
  HeadH4Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../styles/typography";
import Rank from "./common/Rank";
import { useRouter } from "next/router";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";
import Image from "next/image";

const InvestorCard = ({
  investorId,
  investorAvatar,
  investorName,
  totalInvestment,
  totalProfits,
  totalAssets,
  profitPercentageList,
  rank,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile();
  return (
    <InvestorCardWrapper
      onClick={() => router.push(`/investor/${investorId}`)}
      investorAvatar={investorAvatar}
    >
      <Rank rank={rank} />
      {!isMobile ? (
        <>
          <div className="investorImg">
            {investorAvatar ? (
              <div className="investor-image-wrapper">
                <Image
                  alt={investorName}
                  src={investorAvatar}
                  width={110}
                  height={110}
                />
              </div>
            ) : (
              <div className="empty"></div>
            )}
          </div>

          <div className="investorName">{investorName}</div>
          <div className="totalProfits">
            <div className="label">Total Profits</div>
            <div className="amount">
              ${new Intl.NumberFormat().format(Math.round(totalProfits))}
            </div>
          </div>
        </>
      ) : (
        <div className="mobile-investor-wrapper">
          <div className="investorImg">
            {investorAvatar ? (
              <div className="investor-image-wrapper">
                <Image
                  alt={investorName}
                  src={investorAvatar}
                  width={60}
                  height={60}
                />
              </div>
            ) : (
              <div className="empty"></div>
            )}
          </div>

          <div className="mobile-investor-text-wrapper">
            <div className="investorName">{investorName}</div>
            <div className="totalProfits">
              <div className="label">Total Profits</div>
              <div className="amount">
                ${new Intl.NumberFormat().format(Math.round(totalProfits))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="stock-wrapper">
        {profitPercentageList
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 3)
          .map(({ stockName, ticker, percent }, index) => {
            return (
              <div className="stock" key={index}>
                {stockName}{" "}
                {new Intl.NumberFormat().format(Math.round(percent))}%
              </div>
            );
          })}
      </div>
    </InvestorCardWrapper>
  );
};

const InvestorCardWrapper = styled.div`
  position: relative;
  border: solid 0.1rem ${color.B80};
  width: 22.8rem;
  padding: 2.4rem;
  border-radius: 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }

  .investor-image-wrapper {
    img {
      object-fit: cover;
      border-radius: 99.9rem;
      margin-right: 1rem;
      margin-bottom: 1rem;
      text-indent: 100%;
      white-space: nowrap;
    }
  }

  .investorImg {
    width: 11rem;
    height: 11rem;
    background-color: gray;
    border-radius: 999px;
    margin-bottom: 0.8rem;
  }

  .investorName {
    ${HeadH4Bold}
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0rem;
  }

  .totalProfits {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.6rem;
    & > .label {
      ${Body12Medium};
    }
    & > .amount {
      ${HeadH5Bold};
    }
  }

  .stock-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .stock {
      background-color: ${color.B93};
      width: 100%;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999rem;
      ${Body12Medium};
    }
  }

  .totalAssets {
    color: ${({ totalAssetsTextColor }) => totalAssetsTextColor};
  }

  @media screen and (max-width: ${mobileWidth}) {
    width: 100%;

    .mobile-investor-wrapper {
      display: flex;
      width: 100%;

      .investorImg,
      .avatar {
        .investor-image-wrapper {
          flex: 1;
        }
        width: 6rem;
        min-width: 6rem;
        height: 6rem;
        min-height: 6rem;
      }

      .investorImg {
        margin-right: 1.6rem;
      }

      .totalProfits {
        align-items: flex-start;
      }
    }

    .investorName {
      padding-right: 6rem;
    }
  }
`;

export default InvestorCard;
