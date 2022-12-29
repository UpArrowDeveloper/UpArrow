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

const PostWrapper = styled.div`
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

const PostCard = ({
  theme,
  postId,
  postImage,
  postTitle,
  postAuthor,
  postDate,
  stockId,
}) => {
  const router = useRouter();
  const { data } = useQuery(['stock', stockId], api.stock.getId(stockId));
  const { agreeCount, disagreeCount } = useVoteData(postId);

  return (
    <PostWrapper theme={theme} onClick={() => router.push(`/ideas/${postId}`)}>
      <div className='image'>
        {postImage ? <Img alt='post-card-image' src={postImage} /> : null}
      </div>

      <div className='textBlock'>
        <div className='title'>{postTitle}</div>
        <div className='author'>
          by {postAuthor} · {timeAgo.format(new Date(postDate))}
        </div>
        <div className='tag-wrapper'>
          <Tag>{data?.name}</Tag>
        </div>
        <IdeaVote agreeCount={agreeCount} disagreeCount={disagreeCount} />
      </div>
    </PostWrapper>
  );
};

export default PostCard;
