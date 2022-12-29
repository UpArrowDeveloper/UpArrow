import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import api from '../../apis';
import Vote from '../../components/Vote';
import { env } from '../../config';
import Youtube from '../../components/Youtube';
import InvestorProfile from '../../components/common/InvestorProfile';
import { getInvestorProfileInfo } from '../../utils/investor';
import { Body14Regular, HeadH1Bold, HeadH3Bold } from '../../styles/typography';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import color from '../../styles/color';
import TagPill from '../../components/Editor/TagPill';
import IdeaVote from '../../components/IdeaVote';
import CommentInput from '../../components/CommentInput';
import Button from '../../components/common/Button';
import Comment from '../../components/Comment';
import CommentList from '../../components/CommentList';
import { usePost } from '../../hooks/model/usePost';
import {
  CommentIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from '../../components/icons';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const IdeasBlock = styled.div`
  display: flex;

  .tag-pill-wrapper {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 2.4rem;
  }

  .vote-wrapper {
    margin-bottom: 3.2rem;
  }

  .thumbnail-wrapper {
    width: 100%;
    margin-bottom: 2.4rem;
    & > img {
      width: 100%;
    }
  }

  .sub-header {
    ${HeadH3Bold}

    margin-bottom: 5.6rem;
  }

  .comment-submit-button {
    margin-left: auto;
  }

  .comment-input-wrapper {
    margin-bottom: 1.6rem;
  }

  .comment-list {
    border-top: 0.1rem solid rgba(0, 0, 0, 0.04);
    padding-top: 3.2rem;
    margin-bottom: 3.2rem;
  }
`;

const PostBlock = styled.div`
  position: relative;
  max-width: 72rem;
  padding: 3.2rem 1.2rem;
  display: flex;
  flex-direction: column;

  .post-title {
    ${HeadH1Bold}
    margin-bottom: 1.6rem;
  }
  .post-info {
    ${Body14Regular};
    color: ${color.B40};
    margin-bottom: 1.6rem;
  }
`;

const FloattingMenu = styled.div`
  position: absolute;
  width: 7.2rem;
  top: ${({ scrollTop }) => Number((scrollTop / 10).toFixed(2)) + 3.2}rem;
  right: -10.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  .menu-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 0.1rem solid rgba(0, 0, 0, 0.1);
    border-radius: 0.8rem;

    & > .line {
      width: 5.6rem;
      height: 0.1rem;
      background-color: #ebebeb;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${color.B53};
    ${Body14Regular};
    width: 7.2rem;
    height: 7.2rem;
    cursor: pointer;
  }

  .thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.4rem;

    svg {
      width: 2rem;
      height: 2rem;
      fill: #444444;
    }
  }
`;

const IdeaContent = styled.div`
  // normal-text
  margin-bottom: 1.8rem;

  p {
    color: ${color.B13};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
`;

export default function Ideas({
  investor,
  post: serverPost,
  rank,
  stocksWithPrices,
}) {
  const {
    description,
    followers,
    followings,
    profile_image_url,
    // purchases,
    totalAssets,
    totalInvestment,
    totalProfits,
    username,
    websiteUrl,
  } = investor;
  const availableCash = totalAssets - totalInvestment;
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const { data, isLoading } = useQuery(
    ['user', user?.email],
    api.user.getByEmail(user?.email)
  );
  const commentInputRef = useRef();
  const { post, refetch: refetchPost } = usePost(id);
  const commentIds = post?.commentIds || [];
  const {
    data: voteData,
    isLoading: isVoteDataLoading,
    refetch,
  } = useQuery(['voteByPostId', id], api.vote.getByPostId(id));
  const [comment, setComment] = useState('');
  const { data: comments, isLoading: isCommentsLoading } = useQuery(
    ['comment', commentIds],
    api.comment.getByIds(commentIds)
  );
  const createVote = useMutation(api.vote.post, { onSuccess: () => refetch() });

  const onCommentIconClick = () => {
    commentInputRef.current.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      commentInputRef.current.focus();
    }, 800);
  };

  const onCommentButtonClick = async () => {
    await axios.post(`${env.serverUrl}/comment`, {
      postId: id,
      userId: data._id,
      content: comment,
      likes: [],
    });
    refetchPost();
  };

  const [scrollTop, setScrollTop] = useState(0);
  useLayoutEffect(() => {
    const event = window.addEventListener('scroll', () => {
      setScrollTop(document.documentElement.scrollTop);
    });
    return () => window.removeEventListener('scroll', event);
  }, []);

  if (isLoading || isVoteDataLoading) {
    return null;
  }

  const { agreeCount, disagreeCount } = voteData.data.reduce(
    (acc, vote) => {
      if (vote.isAgree) {
        return {
          ...acc,
          agreeCount: acc.agreeCount + 1,
        };
      }
      return {
        ...acc,
        disagreeCount: acc.disagreeCount + 1,
      };
    },
    { agreeCount: 0, disagreeCount: 0 }
  );

  return (
    <IdeasBlock>
      <div>
        <InvestorProfile
          profile_image_url={profile_image_url}
          username={username}
          investedCompanies={stocksWithPrices}
          followers={followers}
          followings={followings}
          description={description}
          websiteUrl={websiteUrl}
          availableCash={availableCash}
          totalInvestment={totalInvestment}
          totalProfits={totalProfits}
          totalAssets={totalAssets}
          rank={rank}
        />
      </div>
      <PostBlock>
        <h1 className='post-title'>{serverPost.title}</h1>
        <div className='post-info'>
          by {serverPost.username} · {timeAgo.format(new Date(serverPost.date))}
        </div>
        <div className='tag-pill-wrapper'>
          {stocksWithPrices.map((stock) => (
            <TagPill
              key={stock._id}
              stockImageUrl={stock.profile_image_url}
              label={stock.name}
            />
          ))}
        </div>
        <div className='vote-wrapper'>
          <IdeaVote agreeCount={agreeCount} disagreeCount={disagreeCount} />
        </div>
        <div className='thumbnail-wrapper'>
          <img src={serverPost.thumbnailImageUrl} />
        </div>

        {serverPost.youtubeCode && (
          <Youtube youtubeCode={serverPost.youtubeCode} />
        )}

        <IdeaContent dangerouslySetInnerHTML={{ __html: serverPost.content }} />

        <h2 className='sub-header'>Comments</h2>
        {comments && (
          <CommentList className='comment-list' comments={comments} />
        )}

        <CommentInput
          className='comment-input-wrapper'
          value={comment}
          setValue={setComment}
          commentInputRef={commentInputRef}
        />
        <Button
          className='comment-submit-button'
          onClick={onCommentButtonClick}
        >
          Comment
        </Button>
        <FloattingMenu scrollTop={scrollTop}>
          <div className='menu-wrapper'>
            <div
              className='menu'
              onClick={() => {
                createVote.mutate({
                  postId: id,
                  userId: data._id,
                  isAgree: true,
                });
              }}
            >
              <div className='thumb'>
                <ThumbUpIcon />
              </div>
              <span>{agreeCount}</span>
            </div>
            <div className='line' />
            <div
              className='menu'
              onClick={() => {
                createVote.mutate({
                  postId: id,
                  userId: data._id,
                  isAgree: false,
                });
              }}
            >
              <div className='thumb'>
                <ThumbDownIcon />
              </div>
              <span>{disagreeCount}</span>
            </div>
          </div>
          <div className='menu-wrapper'>
            <div className='menu' onClick={onCommentIconClick}>
              <CommentIcon />
              <span>{commentIds.length}</span>
            </div>
          </div>
        </FloattingMenu>
      </PostBlock>
    </IdeasBlock>
  );
}

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const post = (await axios.get(env.serverUrl + '/post/' + id)).data;
  const { investor, prices, stockPurchaseInfos, userPosts, userRank } =
    await getInvestorProfileInfo(post.userId);
  const stockIds = Object.keys(stockPurchaseInfos);

  const stocks = (
    await Promise.all(
      stockIds.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${id}`)
      )
    )
  ).map((v) => v.data);

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id].quantity * prices[stock.ticker],
    };
  });

  return {
    props: {
      post,
      investor: { ...investor.data },
      prices,
      stockPurchaseInfos,
      stocksWithPrices,
      userPosts,
      userRank,
      rank: userRank,
    },
  };
};
