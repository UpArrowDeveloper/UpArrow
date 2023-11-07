import styled from "@emotion/styled";
import TimeAgo from "javascript-time-ago";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import api from "../../apis";
import Viewmore from "../../components/common/Viewmore";
import OrderChip from "../../components/OrderChip";
import { commonListCss, commonTableCss } from "../../styles/table";
import en from "javascript-time-ago/locale/en";
import Image from "next/image";
import { TagGroup } from "../../components/Tag";
import { Body14Regular, HeadH5Bold } from "../../styles/typography";
import color from "../../styles/color";
import { MainLayout } from "../../Layouts";
import { getInvestorInvestInfo } from "../../utils/investor";
import { useMobile } from "../../hooks/useMobile";
import { mobileWidth } from "../../styles/responsive";
TimeAgo.addDefaultLocale(en);

const orderOptions = [
  "Most Profitable",
  "Most Assests",
  "Most Ideas",
  "Newest",
];

const getSortAlgorithmByOrderOption = (orderOption) => {
  switch (orderOption) {
    case "Most Profitable":
      return (a, b) => b.totalProfits - a.totalProfits;
    case "Most Assests":
      return (a, b) =>
        b.totalInvestment + b.cash - (a.totalInvestment + a.cash);
    case "Most Ideas":
      return (a, b) => b.ideas?.length - a.ideas?.length;
    case "Newest":
      return (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    default:
      return (a, b) => 0;
  }
};

function Investors({
  investors: serverInvestors,
  top3Stocks: serverTop3Stocks,
}) {
  const [orderOption, setOrderOption] = useState();
  const [investors, setInvestors] = useState(serverInvestors);
  const [top3Stocks, setTop3Stocks] = useState(serverTop3Stocks);
  const router = useRouter();
  const { isMobile } = useMobile();

  useEffect(() => {
    const getDatas = async () => {
      const users = await api.user.get();
      const top3StocksResponse = await Promise.all(
        users.map((user) => api.user.getTop3StocksById(user._id))
      );

      const investDataIncludedUsers = await Promise.all(
        users.map(async (user) => {
          const { totalInvestment, totalProfits, currentTotalStockValue } =
            await getInvestorInvestInfo(user._id);
          const ideas = await api.user.getIdeasById(user._id)();
          return {
            ...user,
            totalInvestment,
            totalProfits,
            ideas,
            currentTotalStockValue,
          };
        })
      );
      setInvestors(investDataIncludedUsers);
      setTop3Stocks(top3StocksResponse);
    };
    setTimeout(() => {
      // for image load first
      getDatas();
    }, 2000);
  }, []);

  return (
    <IdeasBlock>
      <header>
        <h1>Investors</h1>
      </header>
      <nav className="order-option-wrapper">
        {orderOptions.map((order) => (
          <OrderChip
            key={order}
            selected={order === orderOption}
            onClick={() => setOrderOption(order)}
            order={order}
          />
        ))}
      </nav>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: "1rem" }}></th>
              <th style={{ paddingLeft: "0.8rem" }}></th>
              {!isMobile && <th>Top 3 Stocks</th>}
              <th>Ideas</th>
              {!isMobile && <th>Total Profits</th>}
              <th>{!isMobile ? "Total" : ""} Assets</th>
            </tr>
          </thead>
          <tbody>
            {investors
              ?.sort(getSortAlgorithmByOrderOption(orderOption))
              ?.map((investor, index) => (
                <tr
                  key={investor._id}
                  onClick={() => router.push(`/investor/${investor._id}`)}
                >
                  <td className="comments wrapper index">{index + 1}</td>
                  <td>
                    <div className="title wrapper investors">
                      <div className="image-container">
                        <div className="image-wrapper rounded">
                          {!!investor.profileImageUrl ? (
                            <Image
                              objectFit="cover"
                              src={investor.profileImageUrl}
                              layout="fill"
                              alt={investor.name}
                            />
                          ) : (
                            <div className="empty"></div>
                          )}
                        </div>
                      </div>
                      <div className="title-author">
                        <h5>{investor.name}</h5>
                      </div>
                    </div>
                  </td>
                  {!isMobile && (
                    <td>
                      <div className="wrapper top3">
                        <TagGroup
                          tags={
                            top3Stocks?.[index]?.map(({ name, profit }) => ({
                              name: `${name} ${
                                profit?.toLocaleString("en-US") || 0
                              }%`,
                              type:
                                profit > 0
                                  ? "plus"
                                  : profit === 0
                                  ? "outline"
                                  : "minus",
                            })) || []
                          }
                        />
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="comments wrapper numbers">
                      {investor.ideas.length?.toLocaleString("en-US")}
                    </div>
                  </td>
                  {!isMobile && (
                    <td>
                      <div className="comments wrapper numbers">
                        $
                        {Math.round(investor.totalProfits)?.toLocaleString(
                          "en-US"
                        )}
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="comments wrapper numbers">
                      $
                      {Math.round(
                        investor.currentTotalStockValue + investor.cash
                      )?.toLocaleString("en-US")}
                    </div>
                  </td>
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
    </IdeasBlock>
  );
}

export default function IdeasPage(props) {
  return (
    <MainLayout>
      <Investors {...props} />
    </MainLayout>
  );
}

export async function getStaticProps() {
  const users = await api.user.get();
  const top3Stocks = await Promise.all(
    users.map((user) => api.user.getTop3StocksById(user._id))
  );

  const investDataIncludedUsers = await Promise.all(
    users.map(async (user) => {
      const { totalInvestment, totalProfits, currentTotalStockValue } =
        await getInvestorInvestInfo(user._id);
      const ideas = await api.user.getIdeasById(user._id)();
      return {
        ...user,
        totalInvestment,
        totalProfits,
        ideas,
        currentTotalStockValue,
      };
    })
  );

  return {
    props: {
      investors: investDataIncludedUsers,
      top3Stocks,
    },
  };
}

const IdeasBlock = styled.div`
  ${commonListCss};
  ${commonTableCss};

  table {
    .title {
      display: flex;
      align-items: center;
    }

    td {
      vertical-align: top;
      & > div {
        display: flex;
        align-items: center;
      }
    }

    .image-wrapper {
      .empty {
        background-color: rgba(0, 0, 0, 0.1);
        width: 100%;
        height: 100%;
      }
    }

    h5 {
      ${HeadH5Bold}
    }

    .wrapper {
      height: 11.2rem;
      vertical-align: middle;
    }

    .title-author {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.4rem;
    }
    .author {
      ${Body14Regular}
      color: ${color.B40}
    }

    .idea-vote {
      width: 23.2rem;
      & > div {
        width: 100%;
      }
    }

    .top3 {
      margin-right: 2rem;
    }

    .comments {
      font-style: normal;
      font-weight: 500;
      font-size: 1.6rem;
      line-height: 2.2rem;
    }
  }

  .rounded {
    border-radius: 999rem;
    overflow: hidden;
  }

  .index {
    padding: 0 2.6rem;
  }

  .numbers {
    width: 10rem;
  }

  .stocks {
    width: 32rem;
  }

  .investors {
    width: 22rem;
  }

  @media screen and (max-width: ${mobileWidth}) {
    h1 {
      margin-top: 2rem;
    }
    .investors {
      width: auto;
    }
    .numbers {
      width: auto;
    }
    table h5 {
      width: auto;
    }

    table .wrapper {
      height: auto;
    }

    .index {
      padding: 0 0.9rem;
      text-align: center;
    }

    table td {
      vertical-align: middle;
    }

    table thead tr th {
      text-align: center;
    }
    .comments {
      justify-content: center;
    }
  }
`;
