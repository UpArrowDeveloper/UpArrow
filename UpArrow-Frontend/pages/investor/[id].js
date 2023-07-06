import React from "react";
import styled from "@emotion/styled";
import IdeaCard from "../../components/IdeaCard";

import axios from "axios";
import { numberComma } from "../../utils/number";
import {
  getInvestorInvestInfo,
  getInvestorProfileInfo,
} from "../../utils/investor";
import InvestorProfileView from "../../components/common/InvestorProfile";
import {
  Body14Medium,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../styles/typography";
import color from "../../styles/color";
import api from "../../apis";
import { MainLayout } from "../../Layouts";
import { mobileWidth } from "../../styles/responsive";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export function Investor({ investor, stocksWithPrices, rank }) {
  const {
    data,
    isLoading,
    refetch: userRefetch,
  } = useQuery(
    ["user", investor?.email],
    api.user.getByEmail(investor?.email),
    {
      enabled: !!investor?.email,
    }
  );
  const {
    _id,
    cash,
    comments,
    description,
    email,
    followers,
    followings,
    isAdmin,
    likes,
    name,
    password,
    ideas,
    profileImageUrl,
    // purchases,
    stockPreference,
    totalInvestment,
    totalProfits,
    username,
    websiteUrl,
  } = investor;

  const router = useRouter();

  return (
    <InvestorBlock>
      <InvestorProfileView
        id={_id}
        profileImageUrl={profileImageUrl}
        username={username}
        investedCompanies={stocksWithPrices}
        followers={data?.followers || followers}
        followings={data?.followings || followings}
        description={description}
        websiteUrl={websiteUrl}
        cash={cash}
        totalInvestment={totalInvestment}
        totalProfits={totalProfits}
        totalAssets={totalInvestment + cash}
        rank={rank}
        userRefetch={userRefetch}
      />
      <InvestorDataBlock>
        <div className="portfolio-wrapper">
          <div className="investor-title">{username}'s Portfolio</div>
          <div className="stocks">
            {stocksWithPrices.map((company) => (
              <div
                className="stock"
                key={company.name}
                onClick={() => {
                  router.push(`/stock/${company.ticker}`);
                }}
              >
                <img className="stock-logo" src={company.logoUrl} />
                <div className="stock-info">
                  <div className="stock-name">{company.name}</div>
                  <div className="stock-quantity">
                    {company.quantity} shares
                  </div>
                  <div className="stock-total-value">
                    ${numberComma(company.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">View All</div>
        </div>
        <div className="ideas-wrapper">
          <div className="ideas">
            <div className="investor-title">{username}'s Ideas</div>
            <div className="ideas-content-wrapper">
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea._id}
                  theme={"none"}
                  ideaId={idea._id}
                  ideaImage={idea.thumbnailImageUrl}
                  ideaTitle={idea.title}
                  ideaAuthor={username}
                  ideaDate={idea.date}
                  stockId={idea.stockId}
                />
              ))}
            </div>
          </div>
          <div className="view-all">View All</div>
        </div>
      </InvestorDataBlock>
    </InvestorBlock>
  );
}

export default function Page(props) {
  return (
    <MainLayout>
      <Investor {...props} />
    </MainLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const { investor, stockPurchaseInfos, userIdeas, userRank } =
    await getInvestorProfileInfo(id);

  const { totalInvestment, totalProfits } = await getInvestorInvestInfo(id);
  const stockIds = Object.keys(stockPurchaseInfos);

  const stocks =
    stockIds.length > 0 ? await api.stock.getByIds(stockIds.join(","))() : [];

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id].quantity * stock.currentPrice,
    };
  });

  return {
    props: {
      investor: {
        ...investor,
        ideas: userIdeas,
        totalInvestment,
        totalProfits,
      },
      stocksWithPrices,
      rank: userRank,
    },
  };
}

const InvestorBlock = styled.div`
  display: flex;

  @media screen and (max-width: ${mobileWidth}) {
    flex-direction: column;
  }
`;

const InvestorDataBlock = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1.8rem;

  .investor-title {
    ${HeadH3Bold}
    margin-bottom: 2.4rem;
  }

  .portfolio-wrapper {
    width: 100%;
    margin-bottom: 2rem;
    border-bottom: 0.1rem solid ${color.B93};
    padding: 3.2rem;

    .stocks {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;

      margin-bottom: 2.4rem;

      .stock {
        border: 0.1rem solid ${color.B93};
        border-radius: 0.8rem;
        padding: 1.2rem 1.6rem;
        width: calc(50% - 0.8rem);
        display: flex;
        gap: 1.6rem;
        align-items: center;
        cursor: pointer;

        .stock-logo {
          width: 7.2rem;
          height: 7.2rem;
        }

        .stock-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          .stock-name {
            ${HeadH5Bold}
          }

          .stock-quantity {
            ${Body14Medium}
            color: ${color.B27}
          }

          .stock-total-value {
            ${HeadH6Bold}
            color: ${color.AGREE_GREEN}
          }
        }
      }
    }
  }

  .rank {
    font-size: 2rem;
  }

  .view-all {
    display: flex;
    justify-content: center;
    align-items: center;
    ${HeadH6Bold}
    border: 0.1rem solid ${color.B80};
    border-radius: 0.4rem;
    height: 4.4rem;
    cursor: pointer;
  }

  .ideas-wrapper {
    width: 100%;
    margin-bottom: 2rem;
    padding: 3.2rem;

    .ideas {
      margin-bottom: 2.6rem;

      .ideas-content-wrapper {
        display: flex;
        flex-wrap: wrap;

        gap: 2rem;
      }
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .portfolio-wrapper {
      padding-top: 0;

      & .stocks .stock {
        width: 100%;

        .stock-logo {
          width: 5.6rem;
          height: 5.6rem;
          border-radius: 999rem;
          border: 0.1rem solid rgba(0 0 0 / 20%);
        }
      }
      .view-all {
        height: 3.6rem;
      }
    }
  }
`;
