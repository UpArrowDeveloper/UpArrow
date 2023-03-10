import styled from '@emotion/styled';
import {
  Body14Regular,
  HeadH3Bold,
  HeadH4Bold,
  HeadH5Bold,
} from '../../styles/typography';
import { TargetIcon } from '../../components/icons';
import color from '../../styles/color';
import IdeaCard from '../../components/IdeaCard';
import Viewmore from '../common/Viewmore';
import { useEffect, useRef, useState } from 'react';
import { isNumber } from '../../utils/number';
import { useMutation } from '@tanstack/react-query';
import api from '../../apis';

const InvestSimulatorIdeasBlock = styled.div`
  display: flex;
  gap: 3.2rem;

  .mt-5 {
    margin-top: 0.5rem;
  }

  h3 {
    ${HeadH3Bold}
    margin-bottom: 1.6rem;
  }
  h4 {
    ${Body14Regular};
    color: ${color.B40};
    margin-bottom: 1.2rem;
  }
  .cell {
    padding: 3.2rem;
    border: 0.1rem solid rgba(0 0 0 / 10%);
    border-radius: 1.6rem;
    &.post-cell {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }
  }

  .invest-simulator {
    width: 100%;
    .current-price {
      font-size: 4rem;
      font-weight: 600;
      line-height: 4.8rem;
      letter-spacing: -2%;
    }

    .target-price-block {
      margin: 0.8rem 0;
      display: flex;
      align-items: center;
      margin-bottom: 2.4rem;
    }

    .target-price {
      margin: 0 0.6rem;
      font-size: 1.6rem;
      line-height: 1.93rem;
      color: ${color.B40};
      font-weight: 500;

      strong {
        font-weight: 600;
        color: ${color.B13};
      }
    }

    .recommander {
      background-color: #f5f5f5;
      color: ${color.B40};
      padding: 0.3rem 0.6rem;
      border: 0.1rem solid ${color.B80};
      border-radius: 0.4rem;
    }

    .price-calculate {
      border: 0.1rem solid #e6e6e6;
      border-radius: 0.8rem;
      margin-bottom: 1.6rem;

      & > div {
        &:not(:last-child) {
          border-bottom: 0.1rem solid #e6e6e6;
        }
        padding: 1.6rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.45rem;
        color: ${color.B53};

        & > input {
          border: none;
          text-align: right;
          ${HeadH4Bold};
          &:focus {
            outline: none;
          }
        }
      }

      .total {
        background-color: #e6e6e6;
        padding: 0.8rem 1.6rem;

        & > input {
          background-color: #e6e6e6;
          font-size: 1.6rem;
          line-height: 1.93rem;
          color: ${color.B40};
        }
      }
    }
    .button-group {
      display: flex;
      gap: 0.8rem;
      margin-bottom: 2.4rem;
      padding-bottom: 2.4rem;
      border-bottom: 0.1rem solid #ebebeb;

      button {
        cursor: pointer;
        border: none;
        padding: 1.6rem 2.4rem;
        width: 100%;
        color: white;
        ${HeadH5Bold};
        border-radius: 0.8rem;

        &.sell {
          background-color: ${color.DISAGREE_RED};
        }
        &.buy {
          background-color: ${color.AGREE_GREEN};
        }
      }
    }

    .cash-info {
      display: flex;
      gap: 1.6rem;
      & > div {
        width: 100%;
      }

      .cash {
        ${HeadH4Bold};
      }
    }
  }

  .ideas {
    width: 50%;
  }
`;

const post = {
  _id: '63972b184ad7d65fde4a652e',
  stockIds: ['62fee07cde1c5bad8cfc08cb', '625df77f64720d1b2e16b79a'],
  userId: '634811dbbd1140eacb72d9f2',
  username: 'pkiopb',
  youtubeCode: null,
  title: 'Believing These 8 Myth About Apple Keeps You From Growing',
  content:
    "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><br></p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p><br></p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
  date: 'Mon Dec 12 2022 22:22:32 GMT+0900 (Korean Standard Time)',
  likes: [],
  thumbnailImageUrl:
    'https://uparrow-images.s3.ap-northeast-2.amazonaws.com/Frame%20194.png',
  __v: 0,
  commentIds: [
    '6399ceb74c3cac3ead004c9d',
    '6399cf6adda21ac4f42e3a64',
    '6399cf94834d1c616c10083b',
    '6399cfd1a101f41478e1b196',
    '6399cfd7a101f41478e1b19f',
    '6399cff4a101f41478e1b1ed',
    '6399d077a101f41478e1b242',
    '639b0ef8a6e88d1256eb060c',
    '639b10b7a6e88d1256eb0758',
    '639b10c5a6e88d1256eb0786',
  ],
  updatedAt: '2022-12-15T12:19:17.233Z',
};

const getProfitPercent = (currentPrice, targetPrice) => {
  const sign = currentPrice - targetPrice >= 0 ? '+' : '';
  return `${sign}${(
    ((targetPrice - currentPrice) / currentPrice) *
    100
  ).toFixed(2)}%`;
};

const InvestSimulatorIdeas = ({
  className,
  stock,
  user,
  onBuyClick,
  onSellClick,
  currentStockValuation,
  ideaList,
  ...restProps
}) => {
  const [targetPriceIndex, setTargetPriceIndex] = useState(0);

  const targetPrice = stock.targetPrices[targetPriceIndex];
  useEffect(() => {
    setInterval(() => {
      setTargetPriceIndex((s) => (s + 1) % stock.targetPrices.length);
    }, 1000);
  }, []);

  const [stockOrderQuantity, setStockOrderQuantity] = useState(0);

  return (
    <InvestSimulatorIdeasBlock className={className} {...restProps}>
      <div className='invest-simulator'>
        <h3>Invest Simulator</h3>
        <div className='cell'>
          <h4>Current Price</h4>
          <div className='current-price'>${stock.currentPrice}</div>
          <div className='target-price-block'>
            <TargetIcon />
            <span className='target-price'>
              <strong>${targetPrice.price}</strong>(
              {getProfitPercent(stock.currentPrice, targetPrice.price)})
            </span>
            <div className='recommander'>{targetPrice.name}</div>
          </div>
          <div>
            <h4>Order</h4>
            <div className='price-calculate'>
              <div className='stocks'>
                <div>Stocks</div>
                <input
                  value={stockOrderQuantity.toLocaleString()}
                  onChange={(e) => {
                    const v = e.target.value.replaceAll(',', '');
                    isNumber(v) && setStockOrderQuantity(Number(v));
                  }}
                />
              </div>
              <div className='total'>
                <div>Total</div>
                <input
                  value={`$${(
                    stock.currentPrice * stockOrderQuantity
                  ).toLocaleString()}`}
                />
              </div>
            </div>
          </div>
          <div className='button-group'>
            <button
              className='sell'
              onClick={() => onSellClick(stockOrderQuantity)}
            >
              Sell
            </button>
            <button
              className='buy'
              onClick={() => onBuyClick(stockOrderQuantity)}
            >
              Buy
            </button>
          </div>
          <div className='cash-info'>
            <div>
              <h4>My Current Simulation Cash</h4>
              <div className='cash'>${user?.cash.toLocaleString()}</div>
            </div>
            <div>
              <h4>My Current Stock Valuation</h4>
              <div className='cash'>
                ${currentStockValuation?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='ideas'>
        <h3>Ideas</h3>
        <div className='cell post-cell'>
          {ideaList.map((idea) => (
            <IdeaCard
              ideaId={idea._id}
              ideaImage={idea.thumbnailImageUrl}
              ideaTitle={idea.title}
              ideaAuthor={idea.username}
              ideaDate={idea.date}
              ideaLikes={idea.likes?.length || 0}
              ideaStockIds={idea.stockIds}
            />
          ))}

          <Viewmore className='mt-5' />
        </div>
      </div>
    </InvestSimulatorIdeasBlock>
  );
};

export default InvestSimulatorIdeas;
