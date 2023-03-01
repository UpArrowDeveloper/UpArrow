import styled from '@emotion/styled';
import { useState } from 'react';
import { MainLayout } from '../../Layouts';
import { HeadH5Bold } from '../../styles/typography';
import Image from 'next/image';
import Viewmore from '../../components/common/Viewmore';
import OrderChip from '../../components/OrderChip';
import api from '../../apis';
import { getNumberUnit } from '../../utils/number';
import { useRouter } from 'next/router';
import { commonListCss, commonTableCss } from '../../styles/table';

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
                onClick={() => router.push(`/stock/${stock.ticker}`)}
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

export async function getStaticProps() {
  const stocks = await api.stock.get();

  return {
    props: {
      stocks,
    },
  };
}
