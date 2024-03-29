import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import api from "../../apis";
import Youtube from "../Youtube";
const navbarHeight = "92px";
import Link from "next/link";

import { Body14Medium, HeadH5Bold, HeadH6Bold } from "../../styles/typography";
import { ChevronRightIcon, YoutubeIcon } from "../icons";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EmptyBanner = ({ bannerHeight }) => {
  return (
    <EmptyBannerWrapper
      style={{ marginTop: navbarHeight }}
      bannerHeight={bannerHeight}
    >
      <Skeleton height={bannerHeight} />
      <Skeleton
        style={{ marginTop: "1.6rem", marginLeft: "1.6rem" }}
        width={300}
        height={30}
      />
    </EmptyBannerWrapper>
  );
};
const MobileBanner = () => {
  const { data: apiBanners } = useQuery(["banner"], api.banner.get);
  const banners = apiBanners?.sort((a, b) => a.order - b.order);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentMouseX, setCurrentMouseX] = useState(0);
  const [currentPlayIndexes, setCurrentPlayIndexes] = useState(
    Array(20).fill(false)
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

  if (!banners)
    return <EmptyBanner bannerHeight={bannerHeight} className="empty-banner" />;

  return (
    <BannerWrapperWithText
      className="bwwt"
      onTouchStart={(e) => {
        setCurrentMouseX(e.touches[0]?.clientX);
      }}
      onMouseDown={(e) => {
        setCurrentMouseX(e.clientX);
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        if (e.changedTouches[0]?.clientX - currentMouseX > 10) {
          setCurrentBannerIdx((prev) =>
            prev > 0 ? prev - 1 : banners.length - 1
          );
        } else if (e.changedTouches[0]?.clientX - currentMouseX < -10) {
          setCurrentBannerIdx((prev) =>
            prev < banners.length - 1 ? prev + 1 : 0
          );
        }
      }}
      onMouseUp={(e) => {
        if (e.clientX - currentMouseX > 10) {
          setCurrentBannerIdx((prev) =>
            prev > 0 ? prev - 1 : banners.length - 1
          );
        } else if (e.clientX - currentMouseX < -10) {
          setCurrentBannerIdx((prev) =>
            prev < banners.length - 1 ? prev + 1 : 0
          );
        }
      }}
    >
      <BannerBlock
        bannerHeight={bannerHeight}
        className="bannerblock"
        onClick={() => {
          setCurrentPlayIndexes((prev) => {
            const next = prev.map((v, idx) => {
              if (idx == currentBannerIdx) return !v;
              return false;
            });
            return next;
          });
        }}
      >
        {banners.map((board, idx) => {
          if (!currentPlayIndexes[idx]) {
            return (
              <>
                <Banner
                  bgUrl={board.thumbnailUrl}
                  idx={idx - currentBannerIdx}
                  bannerHeight={bannerHeight}
                ></Banner>
                <YoutubeIcon
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${50 + 100 * (idx - currentBannerIdx)}%`,
                    width: "30%",
                    height: "15%",
                    transform: "translate(-50%, -50%)",
                    transition: "left 0.5s ease-in-out",
                  }}
                />
              </>
            );
          }
          return null;
        })}
      </BannerBlock>

      {currentPlayIndexes[currentBannerIdx] && (
        <Youtube
          youtubeCode={banners[currentBannerIdx].youtubeCode}
          width="100%"
          height={bannerHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
          autoplay={currentPlayIndexes[currentBannerIdx]}
        />
      )}
      <Progress bannerHeight={bannerHeight}>
        {banners.map((board, idx) => {
          return (
            <div
              className={"bubble " + (idx === currentBannerIdx ? "on" : "")}
              onClick={() => {
                setCurrentBannerIdx(idx);
              }}
            ></div>
          );
        })}
      </Progress>
      <InfoWrapper>
        {banners.map((board, idx) => {
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

const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${(props) => props.bannerHeight - 25}px;
  left: 50%;
  height: 2rem;
  transform: translateX(-50%);

  .bubble {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid #eeeeee;
    margin: 0.1rem 0.1rem;
    display: inline-block;

    &.on {
      background-color: #777777;
    }
  }
`;

const EmptyBannerWrapper = styled.div`
  width: 100vw;
  height: calc(240px + ${(props) => props.bannerHeight}px);
`;

const BannerWrapperWithText = styled.div`
  position: relative;
`;

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
  display: flex;
  align-items: center;
  overflow: hidden;
  height: ${(props) => props.bannerHeight}px;
`;

const Banner = styled.div`
  display: flex;
  position: absolute;
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
