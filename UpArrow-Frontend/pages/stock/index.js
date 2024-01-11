import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { MainLayout } from "../../Layouts";
import {
  Body12Medium,
  Body14Medium,
  HeadH5Bold,
} from "../../styles/typography";
import Image from "next/image";
import Viewmore from "../../components/common/Viewmore";
import OrderChip from "../../components/OrderChip";
import api from "../../apis";
import { getNumberUnit } from "../../utils/number";
import { useRouter } from "next/router";
import { commonListCss, commonTableCss } from "../../styles/table";
import { mobileWidth } from "../../styles/responsive";
import { useMobile } from "../../hooks/useMobile";

const orderOptions = ["Popular", "Trending", "Market Cap"];

const getSortAlgorithmByOrderOption = (orderOption) => {
  switch (orderOption) {
    case "Popular":
      return (a, b) => b.commentIds.length - a.commentIds.length;
    case "Trending":
      return (a, b) => b.ideaIds?.length - a.ideaIds?.length;
    case "Market Cap":
      return (a, b) => b.marketCap - a.marketCap;
    default:
      return (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
};
function Home({ initStocks }) {
  const [orderOption, setOrderOption] = useState();
  const [stocks, setStocks] = useState(initStocks);

  const router = useRouter();
  const { isMobile } = useMobile();

  useEffect(() => {
    const getStocks = async () => {
      const stocksResponse = await api.stock.get();
      setStocks(stocksResponse);
    };
    getStocks();
  }, []);

  return (
    <StockBlock>
      <header>
        <h1>Stocks</h1>
      </header>
      <nav className="order-option-wrapper">
        {orderOptions.map((order) => (
          <OrderChip
            selected={order === orderOption}
            onClick={() => setOrderOption(order)}
            key={order}
            order={order}
          />
        ))}
      </nav>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {!isMobile ? <th>Name</th> : <th></th>}
              <th>Price</th>
              {!isMobile && (
                <>
                  <th>Market Cap</th>
                  <th></th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th></th>
                </>
              )}
              <th>Ideas</th>
              {!isMobile && <th>Comments</th>}
            </tr>
          </thead>
          <tbody>
            {stocks
              ?.sort(getSortAlgorithmByOrderOption(orderOption))
              ?.map((stock) => (
                <tr
                  key={stock._id}
                  onClick={() => router.push(`/stock/${stock.ticker}`)}
                >
                  <td>
                    <div className="name-ticker">
                      <div className="image-container">
                        <div className="image-wrapper">
                          {stock.logoUrl && (
                            <Image
                              src={stock.logoUrl}
                              layout="fill"
                              alt={stock.name}
                            />
                          )}
                        </div>
                      </div>
                      <p>{stock.name}</p>
                    </div>
                  </td>
                  <td className="number">
                    <span>${stock.currentPrice?.toLocaleString()}</span>
                  </td>
                  {!isMobile && (
                    <>
                      <td className="number">
                        <span>${getNumberUnit(stock.marketCap)}</span>
                      </td>
                      <td className="divider-wrapper">
                        <span className="divider"></span>
                      </td>
                      <td className="number">
                        <span>{stock.buyerCount.toLocaleString()}</span>
                      </td>
                      <td className="number">
                        <span>{stock.sellerCount.toLocaleString()}</span>
                      </td>
                      <td className="divider-wrapper">
                        <span className="divider"></span>
                      </td>
                    </>
                  )}
                  <td className="number">
                    <span>{stock.ideaIds?.length.toLocaleString() || 0}</span>
                  </td>
                  {!isMobile && (
                    <td className="number">
                      <span>
                        {stock.commentIds.length.toLocaleString() || 0}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isMobile && (
        <div className="view-more-wrapper">
          <Viewmore className="view-more" />
        </div>
      )}
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
      initStocks: stocks,
    },
  };
}

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

  .image-wrapper {
    img {
      border-radius: 999px;
    }
  }

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
        .divider-wrapper {
          vertical-align: middle;
        }
        .divider {
          border-right: 0.1rem solid #d9d9d9;
          font-weight: 500;
          font-size: 1.8rem;
          line-height: 2.2rem;
        }
        span {
          padding-left: 2.5rem;
        }
      }
    }

    @media screen and (max-width: ${mobileWidth}) {
      .name-ticker {
        ${Body14Medium}
        gap:0.8rem;
      }

      .number {
        ${Body12Medium}
      }
    }
  }
`;
