import styled from '@emotion/styled';
import Image from 'next/image';
import { useState } from 'react';
import color from '../../styles/color';
import { HeadH3Bold, HeadH6Bold } from '../../styles/typography';
import CommentInput from '../CommentInput';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import CommentList from '../CommentList';

const OpinionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;

  h3 {
    ${HeadH3Bold}
    margin-bottom: 2.3rem;
  }
  h6 {
    ${HeadH6Bold}
    margin-bottom: 0.8rem;
  }

  .opinion-cards {
    position: relative;
    display: flex;

    .opinion-cards-outer-wrapper {
      overflow: hidden;
      padding-bottom: 3.2rem;
      border-bottom: 0.1rem solid rgba(0, 0, 0, 0.04);
      margin-bottom: 3.2rem;
    }
    .opinion-cards-wrapper {
      transform: translateX(-${({ index, cardWidth }) => index * cardWidth}rem);
      transition: all 0.3s ease-in-out;
      display: flex;
      &::-webkit-scrollbar {
        display: none;
      }
      gap: 2.4rem;
    }

    .left-button {
      cursor: pointer;
      position: absolute;
      top: calc(50% - 2.4rem);
      left: -2.4rem;
      z-index: 500;
      border: 1px solid black;
      border-radius: 999rem;
      background-color: white;
      padding: 1.2rem;
    }

    .right-button {
      cursor: pointer;
      position: absolute;
      top: calc(50% - 2.4rem);
      right: -2.4rem;
      border: 1px solid black;
      z-index: 500;
      border-radius: 999rem;
      background-color: white;
      padding: 1.2rem;
    }
  }

  .comment-wrapper {
    & > div {
      width: 100%;
    }
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1.6rem;

    .comment-submit-btn {
      cursor: pointer;
      width: 9rem;
      height: 4rem;
      background-color: ${color.UpArrow_Blue};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: none;
      border-radius: 0.8rem;
      font-weight: 400;
      font-size: 1.6rem;
      line-height: 2.2rem;
    }
  }

  .comment-list {
    margin-bottom: 3.2rem;
  }
`;

const OpinionCardBlock = styled.div`
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;
  min-width: 52rem;

  .opinion-card-image-wrapper {
    position: relative;
    width: 9.6rem;
    height: 9.6rem;
    margin-bottom: 2.4rem;
  }

  .author {
    font-weight: 500;
    font-size: 1.8rem;
    line-height: 2.2rem;
    margin-bottom: 1.6rem;
  }

  .message {
    font-weight: 600;
    font-size: 2.4rem;
    line-height: 2.9rem;
  }
`;

const OpinionCard = ({ imageUrl, author, message }) => {
  return (
    <OpinionCardBlock>
      <div className='opinion-card-image-wrapper'>
        <Image src={imageUrl} layout='fill' />
      </div>
      <div className='author'>{author} says</div>
      <div className='message'>{message}</div>
    </OpinionCardBlock>
  );
};

const Opinions = ({ comment, setComment, submitComment, ...restProps }) => {
  const opinionCards = [
    {
      imageUrl: '/images/avatar.png',
      author: 'Warren Edward Buffett',
      message:
        '“1A phenomenal company with solid fandom and market dominance that performs well in the face of recession”',
    },
    {
      imageUrl: '/images/avatar.png',
      author: 'Warren Edward Buffett',
      message:
        '“2A phenomenal company with solid fandom and market dominance that performs well in the face of recession”',
    },
    {
      imageUrl: '/images/avatar.png',
      author: 'Warren Edward Buffett',
      message:
        '“3A phenomenal company with solid fandom and market dominance that performs well in the face of recession”',
    },
    {
      imageUrl: '/images/avatar.png',
      author: 'Warren Edward Buffett',
      message:
        '“4A phenomenal company with solid fandom and market dominance that performs well in the face of recession”',
    },
    {
      imageUrl: '/images/avatar.png',
      author: 'Warren Edward Buffett',
      message:
        '“5A phenomenal company with solid fandom and market dominance that performs well in the face of recession”',
    },
  ];
  const [index, setIndex] = useState(0);

  const increaseIndex = () => {
    setIndex((i) => (i < opinionCards.length - 1 ? i + 1 : i));
  };
  const decreaseIndex = () => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  };

  const comments = [
    {
      _id: '6399ceb74c3cac3ead004c9d',
      userId: '633c3585b95485105163c8b8',
      postId: '63972b184ad7d65fde4a652e',
      content: 'test',
      likes: [],
      createdAt: '2022-12-14T13:25:11.992Z',
      updatedAt: '2022-12-14T13:25:11.992Z',
      __v: 0,
    },
    {
      _id: '6399cf6adda21ac4f42e3a64',
      userId: '633c3585b95485105163c8b8',
      postId: '63972b184ad7d65fde4a652e',
      content: 'test',
      likes: [],
      createdAt: '2022-12-14T13:28:10.394Z',
      updatedAt: '2022-12-14T13:28:10.394Z',
      __v: 0,
    },
  ];

  return (
    <OpinionsBlock {...restProps} index={index} cardWidth={52 + 2.4}>
      <h3>Opinions</h3>
      <div className='opinion-cards'>
        <div className='left-button' onClick={decreaseIndex}>
          <ChevronLeftIcon />
        </div>
        <div className='opinion-cards-outer-wrapper'>
          <div className='opinion-cards-wrapper'>
            {opinionCards.map((card) => (
              <OpinionCard {...card} />
            ))}
          </div>
        </div>
        <div className='right-button' onClick={increaseIndex}>
          <ChevronRightIcon />
        </div>
      </div>

      <CommentList className='comment-list' comments={comments} />
      <div className='comment-wrapper'>
        <CommentInput value={comment} setValue={setComment} />
        <button className='comment-submit-btn' onClick={submitComment}>
          Comment
        </button>
      </div>
    </OpinionsBlock>
  );
};

export default Opinions;
