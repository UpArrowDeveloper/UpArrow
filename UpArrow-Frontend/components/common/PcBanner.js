import styled from "@emotion/styled";
import { HeadH1Bold, HeadH3Bold, HeadH4Medium } from "../../styles/typography";
import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../../styles/responsive";
import api from "../../apis";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";
import { AngleLeftTailLine, ChevronRightIcon, YoutubeIcon } from "../icons";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const PcBanner = () => {
  const { data: apiBanners } = useQuery(["banner"], api.banner.get);
  const banners = apiBanners?.sort((a, b) => a.order - b.order);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentPlayIndexes, setCurrentPlayIndexes] = useState(
    Array(100).fill(false)
  );
  const [bannerWidth, setBannerWidth] = useState(128);
  const [bannerHeight, setBannerHeight] = useState(45);
  const bannerWidthRem = `${bannerWidth}rem`;
  const bannerHalfWidthRem = `${bannerWidth / 2}rem`;

  const router = useRouter();

  const windowInnerWidth =
    typeof window !== "undefined" ? window.innerWidth : 500;

  useEffect(() => {
    const handleWindowResize = () => {
      const windowInnerWidth =
        typeof window !== "undefined" ? window.innerWidth : 500;
      setBannerWidth(Math.min(windowInnerWidth * 0.07, 128));
      setBannerHeight(Math.min((windowInnerWidth * 0.07) / 2, 64));
    };
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // const timerRef = useRef(null);
  // useEffect(() => {
  //   setCurrentPlayIndexes((prev) => {
  //     const next = prev.map((v, idx) => {
  //       return false;
  //     });
  //     return next;
  //   });
  //   timerRef.current = setTimeout(() => {
  //     setCurrentPlayIndexes((prev) => {
  //       const next = prev.map((v, idx) => {
  //         if (idx == currentBannerIdx) return true;
  //         return false;
  //       });
  //       return next;
  //     });
  //   }, 3000);
  // }, [currentBannerIdx]);

  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;
  const getLineClamp = () => {
    if (bannerWidth < 55) return 3;
    if (bannerWidth < 65) return 5;
    if (bannerWidth < 75) return 6;
    if (bannerWidth < 85) return 7;
    if (bannerWidth < 95) return 8;
    if (bannerWidth < 105) return 9;
    return 10;
  };

  if (!banners || banners.length === 0)
    return (
      <div
        style={{
          height: bannerHeight + +navbarHeight.replace("rem", "") + "rem",
        }}
      ></div>
    );

  return (
    <BannerBlock
      className="banner-block"
      bannerHalfWidthRem={bannerHalfWidthRem}
      bgUrl={getThumbnailUrl(banners[currentBannerIdx].youtubeCode)}
    >
      <BannerWrapper
        className="banner-wrapper"
        bannerContentIdx={currentBannerIdx - Math.floor(banners.length / 2)}
        bannerWidthRem={bannerWidthRem}
        isEven={banners.length % 2 == 0}
        bannerHeight={bannerHeight}
      >
        <AngleLeftTailLine
          className="angle-left-tail-line"
          onClick={() => {
            setCurrentBannerIdx((prev) => (prev > 0 ? prev - 1 : 0));
          }}
        />
        <div className="banner-content-container">
          {banners.map((board, idx) => (
            <BannerContent
              key={idx}
              className="banner-content"
              bannerContentIdx={idx - currentBannerIdx}
              bannerWidthRem={bannerWidthRem}
              lineClamp={getLineClamp()}
              smallPadding={windowInnerWidth < 850}
            >
              <div
                onClick={() => {
                  setCurrentPlayIndexes((prev) => {
                    const next = prev.map((v, idx) => {
                      if (idx == currentBannerIdx) return true;
                      return false;
                    });
                    return next;
                  });
                }}
                style={{
                  position: "relative",
                  width: 711,
                  height:
                    bannerHeight > 200
                      ? bannerHeight * 5
                      : Math.min(bannerHeight * 6, 448),
                }}
              >
                <Youtube
                  youtubeCode={board.youtubeCode}
                  width="100%"
                  style={{
                    pointerEvents: !currentPlayIndexes[idx] ? "none" : "",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  height="100%"
                  autoplay={currentPlayIndexes[idx]}
                />
                {!currentPlayIndexes[idx] && (
                  <>
                    <Image
                      layout="fill"
                      src={
                        board?.thumbnailUrl ||
                        "/images/test-youtube-thumbnail.png"
                      }
                    />
                    <YoutubeIcon
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "30%",
                        height: "15%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </>
                )}
              </div>
              <div
                className="banner-description"
                onClick={() => {
                  if (!board.ticker) {
                    return router.push(`/stock`);
                  }
                  router.push(`/stock/${board.ticker}`);
                }}
              >
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
                ></div>
              </div>
            </BannerContent>
          ))}
        </div>
        <AngleLeftTailLine
          className="angle-right-tail-line"
          onClick={() => {
            setCurrentBannerIdx((prev) =>
              prev < banners.length - 1 ? prev + 1 : banners.length - 1
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
  display: flex;
  align-items: center;

  background-image: url(${(props) => props.bgUrl});
  transition: background-image 1.1s ease-in-out;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  .angle-left-tail-line {
    position: absolute;
    top: calc(50% - 2.4rem);
    left: calc(50% - ${(props) => props.bannerHalfWidthRem} - 5rem);
    transition: left 0.5s ease-in-out;
    z-index: 10;
    cursor: pointer;
  }

  .angle-right-tail-line {
    rotate: 180deg;
    position: absolute;
    top: calc(50% - 2.4rem);
    right: calc(50% - ${(props) => props.bannerHalfWidthRem} - 5rem);
    transition: left 0.5s ease-in-out;
    cursor: pointer;
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

  padding: ${(props) => (props.smallPadding ? "2rem" : "4.8rem")};

  .hidden {
    display: none;
  }
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

  .banner-stock-content {
    ${HeadH4Medium}
    line-height: 3.2rem;
    font-size: 2.8rem;
    margin-bottom: 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; // 얘네를 추가히준다
    -webkit-line-clamp: ${(props) => props.lineClamp};
    -webkit-box-orient: vertical;

    @media screen and (max-width: ${mobileWidth}) {
      ${HeadH4Medium}
    }
  }
`;

const BannerWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: ${(props) => props.bannerHeight}rem;
  backdrop-filter: blur(60px);

  .banner-content-container {
    position: absolute;
    left: calc(
      ${(props) => props.bannerContentIdx || 0} *
        (-${(props) => props.bannerWidthRem} - 8.2rem) -
        ${(props) =>
          props.isEven ? props.bannerWidthRem + "/ 2 - 4.1rem" : "0px"}
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
