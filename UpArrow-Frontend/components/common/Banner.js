import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import {
  HeadH1Bold,
  HeadH4Bold,
  HeadH4Medium,
  HeadH6Bold,
} from "../../styles/typography";
import { ChevronRightMobileIcon, NextIcon } from "../icons";
import { numberComma } from "../../utils/number";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getBannerYMD, getYMD } from "../../utils/date";
import { useMobile } from "../../hooks/useMobile";
import { mobileWidth } from "../../styles/responsive";
import color from "../../styles/color";
import api from "../../apis";

const Banner = ({ config: initConfig }) => {
  const { config, getConfig } = useConfig(initConfig);
  const bannerImageUrl = config?.bannerImageUrl;
  const stock = config?.board;
  const timerRef = useRef();
  const dotLocation = stock?.dotLocation;

  const [bannerStockPrice, setBannerStockPrice] = useState(0);
  const { isMobile } = useMobile();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      getConfig();
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const getStockPrice = async () => {
      const res = await api.stock.getById(stock?.stockId)();
      setBannerStockPrice(res?.currentPrice);
    };
    if (stock?.stockId) {
      getStockPrice();
    }
  }, [stock?.stockId]);

  if (!stock) return null;

  return (
    <BannerBlock>
      <div stockColor={stock.color} dotLocation={dotLocation}>
        <div className="image-wrapper">
          <Image layout="fill" objectFit="cover" src={bannerImageUrl} />
        </div>
        {!isMobile && (
          <div className="board">
            <img className="stock-icon" src={stock.imageUrl} />
            <div className="text">
              If You Invested ${numberComma(stock.importantDateInvestCost)} in{" "}
              <span className="stock-name">{stock.name}</span> on{" "}
              {getBannerYMD(new Date(stock.importantDateString))}, you have $
              {
                numberComma(
                  (stock.importantDateInvestCost / stock.importantDatePrice) *
                    (bannerStockPrice || 1)
                ).split(".")[0]
              }
            </div>
            <div className="chart">
              {stock.chartImageUrl ? (
                <Image layout="fill" src={stock.chartImageUrl} />
              ) : null}
              <div className="dot" />
            </div>
            <div className="more">
              <span>Let's find the next Tesla</span>
              <NextIcon />
            </div>
          </div>
        )}
      </div>
      {isMobile && (
        <div className="board">
          <img className="stock-icon" src={stock.imageUrl} />
          <div className="text">
            If You Invested $10,000 in{" "}
            <span className="stock-name">{stock.name}</span> on{" "}
            {getBannerYMD(new Date(stock.importantDateString))}, you have $
            {
              numberComma(
                (stock.importantDateInvestCost / stock.importantDatePrice) *
                  (bannerStockPrice || 1)
              ).split(".")[0]
            }
          </div>
          <div className="chart">
            {stock.chartImageUrl ? (
              <Image layout="fill" src={stock.chartImageUrl} />
            ) : null}
            <div className="dot" />
          </div>
          <div className="more">
            {isMobile && <div></div>}
            <span>Let's find the next Tesla</span>
            {isMobile ? (
              <ChevronRightMobileIcon style={{ fill: color.B67 }} />
            ) : (
              <NextIcon />
            )}
          </div>
        </div>
      )}
    </BannerBlock>
  );
};

export default Banner;

const BannerBlock = styled.div`
  & > div:first-child {
    background-color: gray;
    position: relative;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 70rem;
  }

  & .board {
    padding: 3.2rem;
    border-radius: 3.42rem;
    width: 51.1rem;
    position: absolute;
    background-color: white;
    right: 15%;
    bottom: 3.7rem;

    .stock-icon {
      width: 7.4rem;
      height: 7.4rem;
      margin-bottom: 1.531rem;
    }

    .text {
      ${HeadH1Bold};

      .stock-name {
        color: ${({ stockColor }) => stockColor};
      }
      margin-bottom: 1.531rem;
    }

    .stock-name {
      color: #e82127;
    }

    .chart {
      position: relative;
      width: 44.7rem;
      height: 18rem;
      margin-bottom: 4.1rem;

      .dot {
        position: absolute;
        top: ${({ dotLocation }) => dotLocation}%;
        right: 1.6rem;
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 2rem;
        background-color: ${({ stockColor }) => stockColor};
        transform: translateY(-0.7rem);

        animation-duration: 0.5s;
        animation-name: fadeInOut;
        animation-iteration-count: infinite;
        animation-direction: alternate;

        @keyframes fadeInOut {
          from {
            opacity: 1;
          }

          to {
            opacity: 0.4;
          }
        }
      }
    }

    .more {
      display: flex;
      justify-content: space-between;
      align-items: center;
      ${HeadH4Medium};
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .image-wrapper {
      height: 28rem;
    }
    .board {
      position: static;
      width: 100%;
      padding: 2rem;

      .chart {
        position: relative;
        width: 100%;
        height: 12.8rem;
      }

      .stock-icon {
        width: 4.8rem;
        height: 4.8rem;
        margin-bottom: 1.531rem;
      }

      .text {
        ${HeadH4Bold};
        text-align: center;
      }

      .more {
        ${HeadH6Bold}
      }
    }
  }
`;
