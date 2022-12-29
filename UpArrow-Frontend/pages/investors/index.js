import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import TimeAgo from 'javascript-time-ago';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import api from '../../apis';
import Viewmore from '../../components/common/Viewmore';
import IdeaVote from '../../components/IdeaVote';
import OrderChip from '../../components/OrderChip';
import { commonListCss, commonTableCss } from '../stock';
import en from 'javascript-time-ago/locale/en';
import Image from 'next/image';
import { TagGroup } from '../../components/Tag';
import { Body14Regular, HeadH5Bold } from '../../styles/typography';
import color from '../../styles/color';
import { MainLayout } from '../../Layouts';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');
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

function Investors({ investors }) {
  const router = useRouter();
  const { data: posts } = useQuery(['posts'], api.post.get);
  const [orderOption, setOrderOption] = useState();
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
            <th style={{ paddingLeft: '1rem' }}>Ranks</th>
            <th style={{ paddingLeft: '0.8rem' }}>Investors</th>
            <th>Top3 Stocks</th>
            <th>Ideas</th>
            <th>Total Profits</th>
            <th>Total Assets</th>
          </thead>
          <tbody>
            {investors?.map((investor, index) => (
              <tr>
                <td className='comments wrapper index'>{index + 1}</td>
                <td>
                  <div className='title wrapper investors'>
                    <div className='image-container'>
                      <div className='image-wrapper rounded'>
                        <Image
                          objectFit='cover'
                          src={investor.avatarUrl}
                          layout='fill'
                          alt={investor.name}
                        />
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
                      tags={investor.top3Stocks.map(({ name, profit }) => ({
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
                    {investor.ideas.toLocaleString('en-US')}
                  </div>
                </td>
                <td>
                  <div className='comments wrapper numbers'>
                    ${investor.totalProfits.toLocaleString('en-US')}
                  </div>
                </td>
                <td>
                  <div className='comments wrapper numbers'>
                    ${investor.totalAssets.toLocaleString('en-US')}
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

export function getServerSideProps() {
  const fixtureInvestors = [
    {
      avatarUrl: '/images/warren.png',
      name: 'Warren Buffett',
      top3Stocks: [
        {
          name: 'Apple',
          profit: 1200,
        },
        {
          name: 'Microsoft',
          profit: 240,
        },
        {
          name: 'Google',
          profit: -127,
        },
      ],
      ideas: 112,
      totalProfits: 130200,
      totalAssets: 280200,
    },
    {
      avatarUrl: '/images/warren.png',
      name: 'Warren Buffett',
      top3Stocks: [
        {
          name: 'Apple',
          profit: 1200,
        },
        {
          name: 'Microsoft',
          profit: 240,
        },
        {
          name: 'Google',
          profit: -127,
        },
      ],
      ideas: 112,
      totalProfits: 130200,
      totalAssets: 280200,
    },
    {
      avatarUrl: '/images/warren.png',
      name: 'Warren Buffett',
      top3Stocks: [
        {
          name: 'Apple',
          profit: 1200,
        },
        {
          name: 'Microsoft',
          profit: 240,
        },
        {
          name: 'Google',
          profit: -127,
        },
      ],
      ideas: 112,
      totalProfits: 130200,
      totalAssets: 280200,
    },
  ];
  return {
    props: {
      investors: fixtureInvestors,
    },
  };
}
