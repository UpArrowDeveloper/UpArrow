import React from 'react';
import styled from '@emotion/styled';
import IdeaCard from '../../components/IdeaCard';

import axios from 'axios';
import { numberComma } from '../../utils/number';
import {
  getInvestorInvestInfo,
  getInvestorProfileInfo,
} from '../../utils/investor';
import InvestorProfileView from '../../components/common/InvestorProfile';
import {
  Body14Medium,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from '../../styles/typography';
import color from '../../styles/color';
import api from '../../apis';

const InvestorBlock = styled.div`
  display: flex;
`;

const InvestorDataBlock = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
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
    font-size: 2rema;
  }

  .view-all {
    display: flex;
    justify-content: center;
    align-items: center;
    ${HeadH6Bold}
    border: 0.1rem solid ${color.B80};
    border-radius: 0.4rem;
    height: 4.4rem;
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
`;

// -> 한 함수 / 모듈 / 는 한가지 일만 해야한다.  clean code
// Investor : Investor 페이지를 보여주는 일 // 다른 기능들은 다른 파일에서 .

export default function Investor({ investor, stocksWithPrices, rank }) {
  const {
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

  return (
    <InvestorBlock>
      <InvestorProfileView
        profileImageUrl={profileImageUrl}
        username={username}
        investedCompanies={stocksWithPrices}
        followers={followers}
        followings={followings}
        description={description}
        websiteUrl={websiteUrl}
        cash={cash}
        totalInvestment={totalInvestment}
        totalProfits={totalProfits}
        totalAssets={totalInvestment + cash}
        rank={rank}
      />
      <InvestorDataBlock>
        <div className='portfolio-wrapper'>
          <div className='investor-title'>{username}'s Portfolio</div>
          <div className='stocks'>
            {stocksWithPrices.map((company) => (
              <div className='stock'>
                <img className='stock-logo' src={company.logoUrl} />
                <div className='stock-info'>
                  <div className='stock-name'>{company.name}</div>
                  <div className='stock-quantity'>
                    {company.quantity} shares
                  </div>
                  <div className='stock-total-value'>
                    ${numberComma(company.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='view-all'>View All</div>
        </div>
        <div className='ideas-wrapper'>
          <div className='ideas'>
            <div className='investor-title'>{username}'s Ideas</div>
            <div className='ideas-content-wrapper'>
              {ideas.map((idea) => (
                <IdeaCard
                  theme={'none'}
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
          <div className='view-all'>View All</div>
        </div>
      </InvestorDataBlock>
    </InvestorBlock>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // can also be true or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const { investor, prices, stockPurchaseInfos, userIdeas, userRank } =
    await getInvestorProfileInfo(id);

  const { totalInvestment, totalProfits } = await getInvestorInvestInfo(id);
  const stockIds = Object.keys(stockPurchaseInfos);

  const stocks =
    stockIds.length > 0 ? await api.stock.getByIds(stockIds.join(','))() : [];

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id].quantity * prices[stock.ticker],
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
