import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import api from "../../apis";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";

import { useRouter } from "next/router";

const bannerWidth = 128;
const bannerWidthRem = `${bannerWidth}rem`;
const bannerHalfWidthRem = `${bannerWidth / 2}rem`;

const MobileBanner = ({ config: initConfig }) => {
  const { config, getConfig } = useConfig(initConfig);
  const stock = config?.board;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentMouseX, setCurrentMouseX] = useState(0);
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
    <BannerBlock
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
      {config.boards.map((board, idx) => {
        if (!currentPlayIndexes[idx]) {
          return (
            <Banner
              bgUrl={getThumbnailUrl(board.youtubeCode)}
              idx={idx - currentBannerIdx}
            ></Banner>
          );
        }
        return (
          <Youtube
            style={{ zIndex: -1 }}
            youtubeCode={board.youtubeCode}
            width="100%"
            height={220}
            autoplay={currentPlayIndexes[idx]}
          />
        );
      })}
    </BannerBlock>
  );
};

export default MobileBanner;

const BannerBlock = styled.div`
  position: relative;
  margin-top: ${navbarHeight};
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 22rem;
`;

const Banner = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: ${(props) => props.idx * 100}%;

  background-image: url(${(props) => props.bgUrl});
  transition: left 0.5s ease-in-out;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: white;
  background-position: center;
  width: 100vw;
  height: 22rem;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
`;
