import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import { HeadH1Bold, HeadH3Bold, HeadH4Medium } from "../../styles/typography";
import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../../styles/responsive";
import api from "../../apis";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";
import { AngleLeftTailLine, AngleRightTailLine } from "../icons";

const Banner = ({ config: initConfig }) => {
  const { config, getConfig } = useConfig(initConfig);
  const stock = config?.board;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    const getStockPrice = async () => {
      const res = await api.stock.getById(stock?.stockId)();
      setBannerStockPrice(res?.currentPrice);
    };
    if (stock?.stockId) {
      getStockPrice();
    }
  }, [stock?.stockId]);

  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;

  if (!stock) return null;

  return (
    <BannerBlock>
      <AngleLeftTailLine
        className="angle-left-tail-line"
        onClick={() => {
          setCurrentBannerIdx((prev) =>
            prev < config.boards.length - 1
              ? prev + 1
              : config.boards.length - 1
          );
        }}
      />
      <ContentWrapper>
        {config.boards.map((board, idx) => (
          <BannerWrapper
            bgUrl={getThumbnailUrl(board.youtubeCode)}
            bannerContentIdx={currentBannerIdx - idx}
          >
            <div className="banner-backdrop-filter">
              <BannerContent>
                <Youtube
                  youtubeCode={board.youtubeCode}
                  width="711"
                  height="400"
                />
                <div className="banner-description">
                  <div>
                    <div className="banner-stock-name">{board.stockName}</div>
                    <div className="banner-stock-content">
                      {board.description}
                    </div>
                  </div>
                  <div className="find-next-tesla">
                    Let's find the next {board.stockName}
                  </div>
                </div>
              </BannerContent>
            </div>
          </BannerWrapper>
        ))}
      </ContentWrapper>
      <AngleRightTailLine
        className="angle-right-tail-line"
        onClick={() => {
          setCurrentBannerIdx((prev) => (prev > 0 ? prev - 1 : 0));
        }}
      />
    </BannerBlock>
  );
};

export default Banner;

const BannerBlock = styled.div`
  position: relative;
  margin-top: ${navbarHeight};
  display: flex;
  align-items: center;
  .angle-left-tail-line {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 10;
  }

  .angle-right-tail-line {
    position: absolute;
    top: 50%;
    right: 0;
  }

  @media screen and (max-width: ${mobileWidth}) {
  }
`;

const BannerContent = styled.div`
  display: flex;
  gap: 3.2rem;
  margin: 8rem 0;

  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);

  padding: 4.8rem;

  .banner-description {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    ${HeadH1Bold}
    .banner-stock-name {
      ${HeadH3Bold}
      margin-bottom: 1.2rem;
    }

    .find-next-tesla {
      ${HeadH4Medium}
      padding: 1.2rem;
      padding-left: 0;
    }
  }
`;

const BannerWrapper = styled.div`
  width: 100vw;
  position: absolute;
  top: 0;
  left: calc(${(props) => props.bannerContentIdx || 0} * 100%);
  transition: left 0.5s ease-in-out;
  background-image: url(${(props) => props.bgUrl});
  background-repeat: no-repeat;
  background-size: cover;

  .banner-backdrop-filter {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(60px);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100vw;
  height: 64rem;
`;
