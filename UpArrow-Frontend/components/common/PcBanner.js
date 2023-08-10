import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import { HeadH1Bold, HeadH3Bold, HeadH4Medium } from "../../styles/typography";
import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../../styles/responsive";
import api from "../../apis";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";
import {
  AngleLeftTailLine,
  AngleRightTailLine,
  ChevronRightIcon,
} from "../icons";
import { useRouter } from "next/router";

const bannerWidth = 128;
const bannerWidthRem = `${bannerWidth}rem`;
const bannerHalfWidthRem = `${bannerWidth / 2}rem`;

const PcBanner = ({ config: initConfig }) => {
  const { config } = useConfig(initConfig);
  const stock = config?.board;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentPlayIndexes, setCurrentPlayIndexes] = useState(
    Array(100).fill(false)
  );

  const router = useRouter();
  useEffect(() => {
    const getStockPrice = async () => {
      const res = await api.stock.getById(stock?.stockId)();
      setBannerStockPrice(res?.currentPrice);
    };
    if (stock?.stockId) {
      getStockPrice();
    }
  }, [stock?.stockId]);

  useEffect(() => {
    setTimeout(() => {
      setCurrentPlayIndexes((prev) => {
        const next = prev.map((v, idx) => {
          if (idx == currentBannerIdx) return true;
          return false;
        });
        return next;
      });
    }, 3000);
  }, [currentBannerIdx]);

  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;

  if (!stock) return null;

  return (
    <BannerBlock className="banner-block">
      <BannerWrapper
        className="banner-wrapper"
        bgUrl={getThumbnailUrl(config.boards[currentBannerIdx].youtubeCode)}
      >
        <AngleLeftTailLine
          className="angle-left-tail-line"
          onClick={() => {
            setCurrentBannerIdx((prev) => (prev > 0 ? prev - 1 : 0));
          }}
        />
        <div className="banner-backdrop-filter">
          {config.boards.map((board, idx) => (
            <BannerContent
              className="banner-content"
              bannerContentIdx={idx - currentBannerIdx}
            >
              <Youtube
                youtubeCode={board.youtubeCode}
                width="711"
                height="400"
                autoplay={currentPlayIndexes[idx]}
              />
              <div className="banner-description">
                <div>
                  <div className="banner-stock-name">{board.stockName}</div>
                  <div className="banner-stock-content">
                    {board.description}
                  </div>
                </div>
                <div
                  className="find-next-tesla"
                  onClick={() => {
                    router.push(`/stock`);
                  }}
                >
                  <span>Let's find the next {board.stockName}</span>
                  <ChevronRightIcon />
                </div>
              </div>
            </BannerContent>
          ))}
        </div>
        <AngleRightTailLine
          className="angle-right-tail-line"
          onClick={() => {
            setCurrentBannerIdx((prev) =>
              prev < config.boards.length - 1
                ? prev + 1
                : config.boards.length - 1
            );
          }}
        />
      </BannerWrapper>
    </BannerBlock>
  );
};

export default PcBanner;

const BannerBlock = styled.div`
  position: relative;
  margin-top: ${navbarHeight};
  display: flex;
  align-items: center;
  overflow: hidden;

  .angle-left-tail-line {
    position: absolute;
    top: 50%;
    left: calc(50% - ${bannerHalfWidthRem} - 5rem);
    z-index: 10;
  }

  .angle-right-tail-line {
    position: absolute;
    top: 50%;
    right: calc(50% - ${bannerHalfWidthRem} - 5rem);
  }

  @media screen and (max-width: ${mobileWidth}) {
  }
`;

const BannerContent = styled.div`
  width: ${bannerWidthRem};
  position: absolute;
  left: calc(${(props) => props.bannerContentIdx || 0} * 138rem + 50% - 64rem);
  transition: left 0.5s ease-in-out;
  display: flex;
  gap: 3.2rem;

  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);

  padding: 4.8rem;

  .banner-description {
    width: 44rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    ${HeadH1Bold}
    .banner-stock-name {
      ${HeadH3Bold}
      margin-bottom: 1.2rem;
    }

    .find-next-tesla {
      cursor: pointer;
      width: 100%;
      display: flex;
      justify-content: space-between;
      ${HeadH4Medium}
      padding: 1.2rem;
      padding-left: 0;
    }
  }
`;

const BannerWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 64rem;

  background-image: url(${(props) => props.bgUrl});
  transition: background-image 1.1s ease-in-out;
  background-repeat: no-repeat;
  background-size: cover;

  .banner-backdrop-filter {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100vw;
    height: 100%;
    backdrop-filter: blur(60px);
  }
`;
