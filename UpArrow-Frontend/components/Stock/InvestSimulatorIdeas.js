import styled from "@emotion/styled";
import {
  Body12Medium,
  Body14Regular,
  HeadH2Bold,
  HeadH3Bold,
  HeadH4Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../styles/typography";
import { TargetIcon } from "../../components/icons";
import color from "../../styles/color";
import IdeaCard from "../../components/IdeaCard";
import Viewmore from "../common/Viewmore";
import { useEffect, useRef, useState } from "react";
import { isNumber, numberComma } from "../../utils/number";
import { mobileWidth } from "../../styles/responsive";

const getProfitPercent = (currentPrice, targetPrice) => {
  const sign = targetPrice - currentPrice >= 0 ? "+" : "";
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
  stockOrderQuantity,
  setStockOrderQuantity,
  ...restProps
}) => {
  const [targetPriceIndex, setTargetPriceIndex] = useState(0);

  const targetPrice = stock.targetPrices[targetPriceIndex];
  useEffect(() => {
    setInterval(() => {
      setTargetPriceIndex((s) => (s + 1) % stock.targetPrices.length);
    }, 3000);
  }, []);

  return (
    <InvestSimulatorIdeasBlock className={className} {...restProps}>
      <div className="invest-simulator">
        <h3>Invest Simulator</h3>
        <div className="cell">
          <h4>Current Price</h4>
          <div className="current-price">
            ${numberComma(stock.currentPrice)}
          </div>
          <div className="target-price-block">
            {!!targetPrice && (
              <>
                <TargetIcon />
                <span className="target-price">
                  <strong>${numberComma(targetPrice?.price)}</strong>(
                  {getProfitPercent(stock.currentPrice, targetPrice?.price)})
                </span>
                <div className="recommander">{targetPrice?.name}</div>
              </>
            )}
          </div>
          <div>
            <h4>Order</h4>
            <div className="price-calculate">
              <div className="stocks">
                <div>Stocks</div>
                <input
                  value={stockOrderQuantity.toLocaleString()}
                  onChange={(e) => {
                    const v = e.target.value.replaceAll(",", "");
                    isNumber(v) && setStockOrderQuantity(Number(v));
                  }}
                />
              </div>
              <div className="total">
                <div>Total</div>
                <input
                  value={`$${(
                    stock.currentPrice * stockOrderQuantity
                  ).toLocaleString()}`}
                />
              </div>
            </div>
          </div>
          <div className="cash-info">
            <div>
              <h4>My UpArrow Cash</h4>
              <div className="cash">${user?.cash.toLocaleString()}</div>
            </div>
            <div>
              <h4>Owned {stock.name} shares </h4>
              <div className="cash">
                ${currentStockValuation?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="button-group">
            <button
              className="sell"
              onClick={() => onSellClick(stockOrderQuantity)}
            >
              Sell
            </button>
            <button
              className="buy"
              onClick={() => onBuyClick(stockOrderQuantity)}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
      <div className="ideas">
        <h3>Ideas</h3>
        <div className="cell post-cell">
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

          <Viewmore className="mt-5" />
        </div>
      </div>
    </InvestSimulatorIdeasBlock>
  );
};

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
    padding-left: 3.2rem;

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
          min-width: 0;
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
      padding-bottom: 2.4rem;

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
          border: 0.1rem solid rgba(0, 0, 0, 0.1);
        }
        &.buy {
          background-color: ${color.AGREE_GREEN};
          border: 0.1rem solid rgba(0, 0, 0, 0.1);
        }
      }
    }

    .cash-info {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      margin-bottom: 2rem;

      & > div {
        display: flex;
        justify-content: space-between;

        & h4 {
          margin-bottom: 0;
        }
      }

      .cash {
        ${HeadH6Bold};
      }
    }
  }

  .ideas {
    width: 50%;
  }

  @media screen and (max-width: ${mobileWidth}) {
    flex-direction: column;

    h3 {
      ${HeadH5Bold}
    }

    .cell {
      border: none;
      padding: 0;

      &.post-cell {
        padding: 0;
      }
    }

    .ideas {
      padding-bottom: 2rem;
      margin-bottom: 2rem;
      border-bottom: 0.05rem solid rgba(0, 0, 0, 0.1);
    }

    .invest-simulator {
      border-bottom: 0.05rem solid rgba(0, 0, 0, 0.1);
    }

    .invest-simulator .current-price {
      ${HeadH2Bold}
    }

    .invest-simulator .target-price {
      ${Body12Medium}
    }

    .invest-simulator .button-group button {
      padding: 0.8rem 2.4rem;
    }
  }
`;

export default InvestSimulatorIdeas;
