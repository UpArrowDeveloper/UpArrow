import styled from '@emotion/styled';
import TimeAgo from 'javascript-time-ago';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import api from '../../apis';
import Viewmore from '../../components/common/Viewmore';
import OrderChip from '../../components/OrderChip';
import { commonListCss, commonTableCss } from '../../styles/table';
import en from 'javascript-time-ago/locale/en';
import Image from 'next/image';
import { TagGroup } from '../../components/Tag';
import { Body14Regular, HeadH5Bold } from '../../styles/typography';
import color from '../../styles/color';
import { MainLayout } from '../../Layouts';
import { getInvestorInvestInfo } from '../../utils/investor';
TimeAgo.addDefaultLocale(en);
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

    h5 {
      ${HeadH5Bold}
      width: 40rem;
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
    width: 14rem;
  }

  .stocks {
    width: 32rem;
  }

  .investors {
    width: 32rem;
  }
`;

const orderOptions = [
  'Most Profitable',
  'Most Assests',
  'Most Ideas',
  'Newest',
];

function Investors({ investors, top3Stocks }) {
  const [orderOption, setOrderOption] = useState();
  const router = useRouter();

  return (
    <IdeasBlock>
      <header>
        <h1>Investors</h1>
      </header>
      <nav className='order-option-wrapper'>
        {orderOptions.map((order) => (
          <OrderChip
            key={order}
            selected={order === orderOption}
            onClick={() => setOrderOption(order)}
            order={order}
          />
        ))}
      </nav>
      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th style={{ paddingLeft: '1rem' }}>Ranks</th>
              <th style={{ paddingLeft: '0.8rem' }}>Investors</th>
              <th>Top3 Stocks</th>
              <th>Ideas</th>
              <th>Total Profits</th>
              <th>Total Assets</th>
            </tr>
          </thead>
          <tbody>
            {investors?.map((investor, index) => (
              <tr
                key={investor._id}
                onClick={() => router.push(`/investor/${investor._id}`)}
              >
                <td className='comments wrapper index'>{index + 1}</td>
                <td>
                  <div className='title wrapper investors'>
                    <div className='image-container'>
                      <div className='image-wrapper rounded'>
                        {!!investor.profileImageUrl && (
                          <Image
                            objectFit='cover'
                            src={investor.profileImageUrl}
                            layout='fill'
                            alt={investor.name}
                          />
                        )}
                      </div>
                    </div>
                    <div className='title-author'>
                      <h5>{investor.name}</h5>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='wrapper'>
                    <TagGroup
                      tags={top3Stocks[index]?.map(({ name, profit }) => ({
                        name: `${name} ${profit.toLocaleString('en-US')}%`,
                        type:
                          profit > 0
                            ? 'plus'
                            : profit === 0
                            ? 'outline'
                            : 'minus',
                      }))}
                    />
                  </div>
                </td>
                <td>
                  <div className='comments wrapper numbers'>
                    {investor.ideas.length.toLocaleString('en-US')}
                  </div>
                </td>
                <td>
                  <div className='comments wrapper numbers'>
                    ${investor.totalProfits.toLocaleString('en-US')}
                  </div>
                </td>
                <td>
                  <div className='comments wrapper numbers'>
                    $
                    {(investor.totalInvestment + investor.cash).toLocaleString(
                      'en-US'
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='view-more-wrapper'>
        <Viewmore className='view-more' />
      </div>
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

export async function getServerSideProps() {
  const users = await api.user.get();
  const top3Stocks = await Promise.all(
    users.map((user) => api.user.getTop3StocksById(user._id))
  );

  const investDataIncludedUsers = await Promise.all(
    users.map(async (user) => {
      const { totalInvestment, totalProfits } = await getInvestorInvestInfo(
        user._id
      );
      const ideas = await api.user.getIdeasById(user._id)();
      return {
        ...user,
        totalInvestment,
        totalProfits,
        ideas,
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
