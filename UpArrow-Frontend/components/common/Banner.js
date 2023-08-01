import { useConfig } from "../../hooks/useConfig";
import styled from "@emotion/styled";
import {
  HeadH1Bold,
  HeadH3Bold,
  HeadH4Bold,
  HeadH4Medium,
  HeadH6Bold,
} from "../../styles/typography";
import { ChevronRightMobileIcon, NextIcon } from "../icons";
import { numberComma } from "../../utils/number";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMobile } from "../../hooks/useMobile";
import { mobileWidth } from "../../styles/responsive";
import color from "../../styles/color";
import api from "../../apis";
import { useRouter } from "next/router";
import Youtube from "../Youtube";
import { navbarHeight } from "../Navbar";

const Banner = ({ config: initConfig }) => {
  const { config, getConfig } = useConfig(initConfig);
  const stock = config?.board;
  const timerRef = useRef();

  useEffect(() => {
    const getStockPrice = async () => {
      const res = await api.stock.getById(stock?.stockId)();
      setBannerStockPrice(res?.currentPrice);
    };
    if (stock?.stockId) {
      getStockPrice();
    }
  }, [stock?.stockId]);

  const videoId = "fO54yjlykvw";
  const stockName = "Tesla";
  const thumbnailUrl = `http://img.youtube.com/vi/${videoId}/0.jpg`;

  if (!stock) return null;

  return (
    <BannerBlock bgUrl={thumbnailUrl}>
      <div className="banner-backdrop-filter">
        <div className="banner-content">
          <Youtube youtubeCode={videoId} width="711" height="400" />
          <div className="banner-description">
            <div>
              <div className="banner-stock-name">{stockName}</div>
              <div className="banner-stock-content">
                {"description : tesla is a good company"}
              </div>
            </div>
            <div className="find-next-tesla">
              Let's find the next {stockName}
            </div>
          </div>
        </div>
      </div>
    </BannerBlock>
  );
};

export default Banner;

const BannerBlock = styled.div`
  margin-top: ${navbarHeight};
  width: 100vw;
  height: 64rem;
  background-image: url(${(props) => props.bgUrl});
  background-repeat: no-repeat;
  background-size: cover;

  .banner-backdrop-filter {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(60px);
  }

  .banner-content {
    display: flex;
    gap: 3.2rem;

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
  }
  @media screen and (max-width: ${mobileWidth}) {
  }
`;
