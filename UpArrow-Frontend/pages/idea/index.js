import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import TimeAgo from 'javascript-time-ago';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import api from '../../apis';
import Viewmore from '../../components/common/Viewmore';
import IdeaVote from '../../components/IdeaVote';
import OrderChip from '../../components/OrderChip';
import { commonListCss, commonTableCss } from '../../styles/table';
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
  const [orderOption, setOrderOption] = useState();
  const router = useRouter();

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
            <tr>
              <th>Idea Title</th>
              <th>Stocks</th>
              <th>Comments</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {ideas?.map((idea) => (
              <tr
                key={idea._id}
                onClick={() => router.push(`/idea/${idea._id}`)}
              >
                <td>
                  <div className='title wrapper'>
                    <div className='image-container'>
                      <div className='image-wrapper'>
                        <Image
                          src={idea.thumbnailImageUrl}
                          layout='fill'
                          alt={idea.title}
                        />
                      </div>
                    </div>
                    <div className='title-author'>
                      <h5>{idea.title}</h5>
                      <div className='author'>
                        by {idea.user.username} ·{' '}
                        {timeAgo.format(new Date(idea.updatedAt))}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className='wrapper'>
                    <TagGroup
                      tags={idea.stocks.map(({ name }) => ({ name }))}
                    />
                  </div>
                </td>
                <td>
                  <div className='comments wrapper'>
                    {idea.commentIds.length}
                  </div>
                </td>
                <td>
                  <div className='idea-vote wrapper'>
                    <IdeaVote
                      agreeCount={idea.votes.agreeCount}
                      disagreeCount={idea.votes.disagreeCount}
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

export async function getServerSideProps() {
  const ideas = await api.idea.get();
  const stocksList = [];
  for (let i = 0; i < ideas.length; i++) {
    const item = ideas[i];
    stocksList.push(
      Promise.all(item.stockIds.map((id) => api.stock.getId(id)()))
    );
  }
  const resStockList = await Promise.all(stocksList);
  const votes = (
    await Promise.all(ideas.map((idea) => api.vote.getByIdeaId(idea._id)()))
  ).map(({ data }) => data);

  const users = await Promise.all(
    ideas.map((idea) => api.user.getById(idea.userId)())
  );

  const itemIncludedIdeas = ideas.map((idea, index) => ({
    ...idea,
    stocks: resStockList[index] || [],
    votes: {
      agreeCount: votes[index]?.filter((vote) => vote.isAgree).length || 0,
      disagreeCount: votes[index]?.filter((vote) => !vote.isAgree).length || 0,
    },
    user: users[index],
  }));

  return {
    props: {
      ideas: itemIncludedIdeas,
    },
  };
}
