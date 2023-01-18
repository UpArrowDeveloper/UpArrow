import styled from '@emotion/styled';
import { useState } from 'react';
import { MainLayout } from '../../Layouts';
import { Body14Medium, HeadH1Bold, HeadH5Bold } from '../../styles/typography';
import color from '../../styles/color';
import Image from 'next/image';
import Viewmore from '../../components/common/Viewmore';
import { css } from '@emotion/react';
import OrderChip from '../../components/OrderChip';
import api from '../../apis';
import { getNumberUnit } from '../../utils/number';
import { useRouter } from 'next/router';

export const commonListCss = css`
  padding-top: 3.2rem;
  header {
    padding: 1.6rem 3.2rem;
  }
  h1 {
    ${HeadH1Bold}
  }

  .order-option-wrapper {
    padding: 0.8rem 3.2rem;
    display: flex;
    gap: 0.8rem;
    margin-bottom: 4rem;
  }

  .view-more-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2.4rem;
  }
  .view-more {
    width: 24rem;
  }
`;

export const commonTableCss = css`
  .table-wrapper {
    padding: 0 3.2rem;

    tr {
      cursor: pointer;
    }
  }

  .image-container {
    padding: 1.2rem 0.8rem;
  }

  .image-wrapper {
    position: relative;
    width: 5.6rem;
    height: 5.6rem;
  }

  table {
    width: 100%;
    margin-bottom: 3.2rem;
    thead {
      th {
        ${Body14Medium}
        color: ${color.B40};
        text-align: left;
        padding-bottom: 1.6rem;
      }
      border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
    }

    tbody {
      &:before {
        content: '-';
        display: block;
        line-height: 0.8rem;
        color: transparent;
      }
      tr {
        border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
      }
    }
  }
`;

const StockBlock = styled.div`
  ${commonListCss}

  .name-ticker {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2.4rem;
    ${HeadH5Bold}
  }
  ${commonTableCss};

  table {
    thead {
      th {
        &:not(:first-child) {
          padding-left: 2.5rem;
        }
      }
    }

    .number {
      width: 13rem;
      vertical-align: middle;
      font-weight: 500;
      font-size: 1.8rem;
      line-height: 2.2rem;
    }

    tbody {
      tr {
        .divider {
          border-right: 0.1rem solid #d9d9d9;
          padding-right: 7.5rem;
        }
        span {
          padding-left: 2.5rem;
        }
      }
    }
  }
`;

const orderOptions = ['Popular', 'Trending', 'Market Cap'];

function Home({ stocks }) {
  const [orderOption, setOrderOption] = useState();
  const router = useRouter();
  return (
    <StockBlock>
      <header>
        <h1>Stocks</h1>
      </header>
      <nav className='order-option-wrapper'>
        {orderOptions.map((order) => (
          <OrderChip
            selected={order === orderOption}
            onClick={() => setOrderOption(order)}
            key={order}
            order={order}
          />
        ))}
      </nav>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Name/Ticker</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Ideas</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {stocks?.map((stock) => (
              <tr
                key={stock._id}
                onClick={() => router.push(`/stocks/${stock.ticker}`)}
              >
                <td>
                  <div className='name-ticker'>
                    <div className='image-container'>
                      <div className='image-wrapper'>
                        <Image
                          src={stock.logoUrl}
                          layout='fill'
                          alt={stock.name}
                        />
                      </div>
                    </div>
                    <p>
                      {stock.name} / {stock.ticker}
                    </p>
                  </div>
                </td>
                <td className='number'>
                  <span>${stock.currentPrice.toLocaleString()}</span>
                </td>
                <td className='number'>
                  <span className='divider'>
                    ${getNumberUnit(stock.marketCap)}
                  </span>
                </td>
                <td className='number'>
                  <span>{stock.buyerCount.toLocaleString()}</span>
                </td>
                <td className='number'>
                  <span className='divider'>
                    {stock.sellerCount.toLocaleString()}
                  </span>
                </td>
                <td className='number'>
                  <span>{stock.ideaIds.length.toLocaleString()}</span>
                </td>
                <td className='number'>
                  <span>{stock.commentCount.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='view-more-wrapper'>
        <Viewmore className='view-more' />
      </div>
    </StockBlock>
  );
}

export default function StockPage(props) {
  return (
    <MainLayout>
      <Home {...props} />
    </MainLayout>
  );
}

export async function getServerSideProps() {
  const stocks = await api.stock.get();

  return {
    props: {
      stocks,
    },
  };
}
