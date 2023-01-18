import React from 'react';
import styled from '@emotion/styled';
import en from 'javascript-time-ago/locale/en';
import { useQuery } from '@tanstack/react-query';
import api from '../apis';
import { useRouter } from 'next/router';
import { useVoteData } from '../hooks/useVoteData';
import Tag from './common/Tag';
import IdeaVote from './IdeaVote';
import { Body14Regular, HeadH4Bold } from '../styles/typography';
import color from '../styles/color';
import TimeAgo from 'javascript-time-ago';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const IdeaWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 59rem;
  gap: 2rem;
  cursor: pointer;

  .textBlock {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;

    .title {
      ${HeadH4Bold}
    }

    .author {
      ${Body14Regular}
      color: ${color.B40}
    }

    .dateAndLikes {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
`;

const Img = styled.img`
  margin: auto;
  display: block;
  width: 12rem;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.8rem;
`;

const IdeaCard = ({
  theme,
  ideaId,
  ideaImage,
  ideaTitle,
  ideaAuthor,
  ideaDate,
  ideaStockIds,
}) => {
  const router = useRouter();
  const { data } = useQuery(
    ['ideaStockIds', ideaStockIds],
    api.stock.getByIds(ideaStockIds)
  );
  const { agreeCount, disagreeCount } = useVoteData(ideaId);

  return (
    <IdeaWrapper theme={theme} onClick={() => router.push(`/ideas/${ideaId}`)}>
      <div className='image'>
        {ideaImage ? <Img alt='idea-card-image' src={ideaImage} /> : null}
      </div>

      <div className='textBlock'>
        <div className='title'>{ideaTitle}</div>
        <div className='author'>
          by {ideaAuthor} · {timeAgo.format(new Date(ideaDate))}
        </div>
        <div className='tag-wrapper'>
          <Tag>{data?.name}</Tag>
        </div>
        <IdeaVote agreeCount={agreeCount} disagreeCount={disagreeCount} />
      </div>
    </IdeaWrapper>
  );
};

export default IdeaCard;
