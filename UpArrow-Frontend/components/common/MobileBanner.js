import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import api from "../../apis";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";
import Link from "next/link";

import { useRouter } from "next/router";
import { Body14Medium, HeadH5Bold, HeadH6Bold } from "../../styles/typography";
import { ChevronRightIcon } from "../icons";

const MobileBanner = ({ config: initConfig }) => {
  const { config, getConfig } = useConfig(initConfig);
  const stock = config?.board;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentMouseX, setCurrentMouseX] = useState(0);
  const [currentPlayIndexes, setCurrentPlayIndexes] = useState(
    Array(100).fill(false)
  );

  const [bannerWidth, setBannerWidth] = useState(128);
  const bannerHeight = Math.floor((bannerWidth * 9) / 16);

  useEffect(() => {
    const handleWindowResize = () => {
      const windowInnerWidth =
        typeof window !== "undefined" ? window.innerWidth : 500;
      setBannerWidth(windowInnerWidth);
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
    }, 5000);
  }, [currentBannerIdx]);

  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;

  if (!stock) return null;

  return (
    <BannerWrapperWithText>
      <BannerBlock
        bannerHeight={bannerHeight}
        className="bannerblock"
        onTouchStart={(e) => {
          setCurrentMouseX(e.touches[0]?.clientX);
        }}
        onMouseDown={(e) => {
          setCurrentMouseX(e.clientX);
        }}
        onTouchEnd={(e) => {
          if (e.changedTouches[0]?.clientX - currentMouseX > 0) {
            setCurrentBannerIdx((prev) =>
              prev > 0 ? prev - 1 : config.boards.length - 1
            );
          } else {
            setCurrentBannerIdx((prev) =>
              prev < config.boards.length - 1 ? prev + 1 : 0
            );
          }
        }}
        onMouseUp={(e) => {
          if (e.clientX - currentMouseX > 0) {
            setCurrentBannerIdx((prev) =>
              prev > 0 ? prev - 1 : config.boards.length - 1
            );
          } else {
            setCurrentBannerIdx((prev) =>
              prev < config.boards.length - 1 ? prev + 1 : 0
            );
          }
        }}
      >
        {config.boards.reverse().map((board, idx) => {
          if (!currentPlayIndexes[idx]) {
            return (
              <Banner
                bgUrl={getThumbnailUrl(board.youtubeCode)}
                idx={idx - currentBannerIdx}
                bannerHeight={bannerHeight}
              ></Banner>
            );
          }
          return (
            <Youtube
              style={{ zIndex: -1 }}
              youtubeCode={board.youtubeCode}
              width="100%"
              height={bannerHeight}
              autoplay={currentPlayIndexes[idx]}
            />
          );
        })}
      </BannerBlock>
      <InfoWrapper>
        {config.boards.map((board, idx) => {
          return (
            <Info idx={idx - currentBannerIdx}>
              <div className="info-header">{board.stockName}</div>
              <div className="info-desc">{board.description}</div>
              <Link href="/stock">
                <div className="info-find">
                  Let's find the next {board.stockName} <ChevronRightIcon />
                </div>
              </Link>
            </Info>
          );
        })}
      </InfoWrapper>
    </BannerWrapperWithText>
  );
};

export default MobileBanner;

const BannerWrapperWithText = styled.div``;

const InfoWrapper = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 240px;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: ${(props) => props.idx * 100}%;
  transition: left 0.5s ease-in-out;
  width: 100vw;
  padding: 2rem;
  height: 240px;

  .info-header {
    ${HeadH6Bold}
  }

  .info-desc {
    margin: 1.2rem 0;
    ${HeadH5Bold}
  }

  .info-find {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 0;
    ${Body14Medium}
    cursor: pointer;
  }
`;

const BannerBlock = styled.div`
  position: relative;
  margin-top: ${navbarHeight};
  display: flex;
  align-items: center;
  overflow: hidden;
  height: ${(props) => props.bannerHeight}px;
`;

const Banner = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: ${(props) => props.idx * 100}%;

  background-image: url(${(props) => props.bgUrl});
  transition: left 0.5s ease-in-out;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: white;
  background-position: center;
  width: 100vw;
  height: ${(props) => props.bannerHeight}px;
`;
