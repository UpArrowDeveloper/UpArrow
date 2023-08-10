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

const PcBanner = ({ config: initConfig }) => {
  const { config } = useConfig(initConfig);
  const stock = config?.board;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentPlayIndexes, setCurrentPlayIndexes] = useState(
    Array(100).fill(false)
  );
  const [bannerWidth, setBannerWidth] = useState(128);
  const [bannerHeight, setBannerHeight] = useState(64);
  const bannerWidthRem = `${bannerWidth}rem`;
  const bannerHalfWidthRem = `${bannerWidth / 2}rem`;

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

  console.log("bannerWidth", bannerWidth);
  useEffect(() => {
    const handleWindowResize = () => {
      setBannerWidth(Math.min(window.innerWidth * 0.07, 128));
      setBannerHeight(Math.min((window.innerWidth * 0.07) / 2, 64));
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
    <BannerBlock
      className="banner-block"
      bannerHalfWidthRem={bannerHalfWidthRem}
    >
      <BannerWrapper
        className="banner-wrapper"
        bgUrl={getThumbnailUrl(config.boards[currentBannerIdx].youtubeCode)}
        bannerContentIdx={
          currentBannerIdx - Math.floor(config?.boards.length / 2)
        }
        bannerWidthRem={bannerWidthRem}
        bannerHeight={bannerHeight}
      >
        <AngleLeftTailLine
          className="angle-left-tail-line"
          onClick={() => {
            setCurrentBannerIdx((prev) => (prev > 0 ? prev - 1 : 0));
          }}
        />
        <div className="banner-content-container">
          {config.boards.map((board, idx) => (
            <BannerContent
              className="banner-content"
              bannerContentIdx={idx - currentBannerIdx}
              bannerWidthRem={bannerWidthRem}
            >
              <Youtube
                youtubeCode={board.youtubeCode}
                width="711"
                height={
                  bannerHeight > 200
                    ? bannerHeight * 5
                    : Math.min(bannerHeight * 6, 448)
                }
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
        <AngleLeftTailLine
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

  .angle-left-tail-line {
    position: absolute;
    top: calc(50% - 2.4rem);
    left: calc(50% - ${(props) => props.bannerHalfWidthRem} - 5rem);
    transition: left 0.5s ease-in-out;
    z-index: 10;
  }

  .angle-right-tail-line {
    rotate: 180deg;
    position: absolute;
    top: calc(50% - 2.4rem);
    right: calc(50% - ${(props) => props.bannerHalfWidthRem} - 5rem);
    transition: left 0.5s ease-in-out;
  }

  @media screen and (max-width: ${mobileWidth}) {
  }
`;

const BannerContent = styled.div`
  width: ${(props) => props.bannerWidthRem};
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
  height: ${(props) => props.bannerHeight}rem;

  background-image: url(${(props) => props.bgUrl});
  transition: background-image 1.1s ease-in-out;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  .banner-content-container {
    position: absolute;
    left: calc(
      ${(props) => props.bannerContentIdx || 0} *
        (-${(props) => props.bannerWidthRem} - 8.2rem)
    );
    transition: left 0.5s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8.2rem;
    width: 100vw;
    height: 100%;
  }
`;