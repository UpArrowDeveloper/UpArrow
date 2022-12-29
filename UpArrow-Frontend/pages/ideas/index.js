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
`;

const orderOptions = ['Popular', 'Trending', 'Latest'];

function Ideas({ ideas }) {
  const router = useRouter();
  const { data: posts } = useQuery(['posts'], api.post.get);
  const [orderOption, setOrderOption] = useState();
  return (
    <IdeasBlock>
      <header>
        <h1>Ideas</h1>
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
            <th>Idea Title</th>
            <th>Stocks</th>
            <th>Comments</th>
            <th>Votes</th>
          </thead>
          <tbody>
            {ideas?.map((idea) => (
              <tr>
                <td>
                  <div className='title wrapper'>
                    <div className='image-container'>
                      <div className='image-wrapper'>
                        <Image
                          src={idea.logoUrl}
                          layout='fill'
                          alt={idea.title}
                        />
                      </div>
                    </div>
                    <div className='title-author'>
                      <h5>{idea.title}</h5>
                      <div className='author'>
                        by {idea.author} ·{' '}
                        {timeAgo.format(new Date(idea.updatedAt))}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='wrapper'>
                    <TagGroup tags={idea.stocks.map((name) => ({ name }))} />
                  </div>
                </td>
                <td>
                  <div className='comments wrapper'>{idea.comments}</div>
                </td>
                <td>
                  <div className='idea-vote wrapper'>
                    <IdeaVote
                      agreeCount={idea.votes.good}
                      disagreeCount={idea.votes.bad}
                    />
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
      <Ideas {...props} />
    </MainLayout>
  );
}

export function getServerSideProps() {
  const fixtureIdeas = [
    {
      logoUrl: '/images/apple.png',
      title: 'Reasons Why Tesla will Become the Most Valuable Company',
      author: 'Warren Buffett',
      updatedAt: '2022-12-31',
      stocks: ['Apple', 'Microsoft', 'Google'],
      comments: 104,
      votes: {
        good: 1402,
        bad: 302,
      },
    },
    {
      logoUrl: '/images/apple.png',
      title: 'Reasons Why Tesla will Become the Most Valuable Company',
      author: 'Warren Buffett',
      updatedAt: '2022-12-31',
      stocks: ['Apple', 'Microsoft', 'Google'],
      comments: 104,
      votes: {
        good: 1402,
        bad: 302,
      },
    },
    {
      logoUrl: '/images/apple.png',
      title: 'Reasons Why Tesla will Become the Most Valuable Company',
      author: 'Warren Buffett',
      updatedAt: '2022-12-31',
      stocks: ['Apple', 'Microsoft', 'Google'],
      comments: 104,
      votes: {
        good: 1402,
        bad: 302,
      },
    },
  ];
  return {
    props: {
      ideas: fixtureIdeas,
    },
  };
}
