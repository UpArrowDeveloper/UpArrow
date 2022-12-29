import { useConfig } from '../../hooks/useConfig';
import styled from '@emotion/styled';
import { HeadH1Bold, HeadH4Medium } from '../../styles/typography';
import { NextIcon } from '../icons';
import { numberComma } from '../../utils/number';
import { useEffect, useRef } from 'react';

const BannerBlock = styled.div`
  background-color: gray;
  position: relative;
  & > img {
    width: 100%;
    height: 70rem;
    object-fit: cover;
  }

  & > .board {
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

    .chart {
      position: relative;
      width: 44.7rem;
      height: 18rem;
      background-color: #d3d3d3;
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
`;
const Banner = () => {
  const { config, getConfig } = useConfig();
  const bannerImageUrl = config.bannerImageUrl;
  const stock = config?.board;
  const timerRef = useRef();
  const dotLocation = stock?.dotLocation;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('timer run');
      getConfig();
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!stock) return 'loading..';

  return (
    <BannerBlock stockColor={stock.color} dotLocation={dotLocation}>
      <img src={bannerImageUrl} />
      <div className='board'>
        <img className='stock-icon' src={stock.imageUrl} />
        <div className='text'>
          If You Invested $10,000 in{' '}
          <span className='stock-name'>{stock.name}</span> on{' '}
          {stock.importantDateString}, you have $
          {numberComma(
            (
              (10000 / stock.importantDatePrice) *
              config.prices[stock.ticker]
            ).toFixed(2)
          )}
        </div>
        <div className='chart'>
          {stock.chartImageUrl ? <img src={stock.chartImageUrl} /> : null}
          <div className='dot' />
        </div>
        <div className='more'>
          <span>Let's find the next Tesla</span>
          <NextIcon />
        </div>
      </div>
    </BannerBlock>
  );
};

export default Banner;
