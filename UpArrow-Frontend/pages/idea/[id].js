import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useLayoutEffect, useRef, useState } from "react";
const Viewer = dynamic(() => import("../../components/Editor/Viewer"), {
  ssr: false,
});
import axios from "axios";
import { useRouter } from "next/router";
import api from "../../apis";
import { env } from "../../config";
import Youtube from "../../components/Youtube";
import InvestorProfile from "../../components/common/InvestorProfile";
import {
  getInvestorInvestInfo,
  getInvestorProfileInfo,
} from "../../utils/investor";
import { Body14Regular, HeadH1Bold, HeadH3Bold } from "../../styles/typography";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import color from "../../styles/color";
import TagPill from "../../components/Editor/TagPill";
import IdeaVote from "../../components/IdeaVote";
import CommentInput from "../../components/CommentInput";
import Button from "../../components/common/Button";
import CommentList from "../../components/CommentList";
import { useIdea } from "../../hooks/model/useIdea";
import {
  CommentIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "../../components/icons";
import { useAppUser } from "../../hooks/useAppUser";
import { MainLayout } from "../../Layouts";
import { useMobile } from "../../hooks/useMobile";
import { mobileWidth } from "../../styles/responsive";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export function Idea({ investor, idea: serverIdea, rank, stocksWithPrices }) {
  const {
    _id: investorId,
    description,
    followers,
    followings,
    profileImageUrl,
    totalInvestment,
    totalProfits,
    username,
    websiteUrl,
    cash,
  } = investor;
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAppUser();

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
  const commentInputRef = useRef();
  const { idea, refetch: refetchIdea } = useIdea(id);
  const commentIds = idea?.commentIds || [];
  const {
    data: voteData,
    isLoading: isVoteDataLoading,
    refetch,
  } = useQuery(["voteByIdeaId", id], api.vote.getByIdeaId(id));
  const { isMobile } = useMobile();
  const [comment, setComment] = useState("");
  const { data: comments } = useQuery(
    ["comment", commentIds],
    commentIds.length > 0 ? api.comment.getByIds(commentIds) : []
  );
  const createVote = useMutation(api.vote.post, {
    onMutate: (newVote) => {
      return { newVote };
    },
    onError: (error, newVote, context) => {
      console.log(error);
      return { ...newVote, isAgree: !newVote.isAgree };
    },
    onSuccess: () => refetch(),
  });

  const onCommentIconClick = () => {
    commentInputRef.current.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      commentInputRef.current.focus();
    }, 800);
  };

  const onCommentButtonClick = async () => {
    await axios.post(`${env.serverUrl}/comment`, {
      postId: id,
      userId: user._id,
      content: comment,
      likes: [],
    });
    refetchIdea();
  };

  const [scrollTop, setScrollTop] = useState(0);
  useLayoutEffect(() => {
    const event = window.addEventListener("scroll", () => {
      setScrollTop(document.documentElement.scrollTop);
    });
    return () => window.removeEventListener("scroll", event);
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
      {!isMobile && (
        <div>
          <InvestorProfile
            id={investorId}
            profileImageUrl={profileImageUrl}
            username={username}
            investedCompanies={stocksWithPrices}
            followers={data?.followers || followers}
            followings={data?.followings || followings}
            description={description}
            websiteUrl={websiteUrl}
            cash={data?.cash || cash}
            totalInvestment={data?.totalInvestment || totalInvestment}
            totalProfits={data?.totalProfits || totalProfits}
            totalAssets={
              data?.totalInvestment
                ? data?.totalInvestment + data?.cash + data?.totalProfits
                : totalInvestment + cash + totalProfits
            }
            rank={rank}
            userRefetch={userRefetch}
          />
        </div>
      )}
      <PostBlock>
        <h1 className="idea-title">{serverIdea.title}</h1>
        <div className="idea-info">
          <span
            style={{ textDecorationLine: "underline" }}
            onClick={() => router.push(`/investor/${investorId}`)}
          >
            by {username}
          </span>{" "}
          · {timeAgo.format(new Date(serverIdea.date))}
        </div>
        <div className="tag-pill-wrapper">
          {stocksWithPrices.map((stock) => (
            <TagPill
              key={stock._id}
              stockImageUrl={stock.logoUrl}
              label={stock.name}
            />
          ))}
        </div>
        <div className="vote-wrapper">
          <IdeaVote
            agreeCount={agreeCount}
            disagreeCount={disagreeCount}
            onAgreeClick={() => {
              createVote.mutate({
                postId: id,
                userId: data._id,
                isAgree: true,
              });
            }}
            onDisagreeClick={() => {
              createVote.mutate({
                postId: id,
                userId: data._id,
                isAgree: false,
              });
            }}
          />
        </div>

        {serverIdea.youtubeCode && (
          <Youtube youtubeCode={serverIdea.youtubeCode} />
        )}

        <Viewer initialValue={serverIdea.content} />

        <h2 className="sub-header">Comments</h2>
        {comments && (
          <CommentList className="comment-list" comments={comments} />
        )}

        <CommentInput
          className="comment-input-wrapper"
          value={comment}
          setValue={setComment}
          commentInputRef={commentInputRef}
        />
        <Button
          className="comment-submit-button"
          onClick={onCommentButtonClick}
        >
          Comment
        </Button>
        {!isMobile && (
          <FloattingMenu scrollTop={scrollTop}>
            <div className="menu-wrapper">
              <div
                className="menu"
                onClick={() => {
                  createVote.mutate({
                    postId: id,
                    userId: data._id,
                    isAgree: true,
                  });
                }}
              >
                <div className="thumb">
                  <ThumbUpIcon />
                </div>
                <span>{agreeCount}</span>
              </div>
              <div className="line" />
              <div
                className="menu"
                onClick={() => {
                  createVote.mutate({
                    postId: id,
                    userId: data._id,
                    isAgree: false,
                  });
                }}
              >
                <div className="thumb">
                  <ThumbDownIcon />
                </div>
                <span>{disagreeCount}</span>
              </div>
            </div>
            <div className="menu-wrapper">
              <div className="menu" onClick={onCommentIconClick}>
                <CommentIcon />
                <span>{commentIds.length}</span>
              </div>
            </div>
          </FloattingMenu>
        )}
      </PostBlock>
    </IdeasBlock>
  );
}

export default function Page(props) {
  return (
    <MainLayout>
      <Idea {...props} />
    </MainLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking", // can also be true or 'blocking'
  };
}

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const idea = await api.idea.getById(id)();

  const { investor, stockPurchaseInfos, userIdeas, userRank } =
    await getInvestorProfileInfo(idea.userId);

  const stocks = await api.stock.getByIds(idea.stockIds.join(","))();

  const stocksWithPrices = stocks.map((stock) => {
    return {
      ...stock,
      ...stockPurchaseInfos[stock._id],
      totalValue: stockPurchaseInfos[stock._id]?.quantity * stock.currentPrice,
    };
  });
  const { totalInvestment, totalProfits } = await getInvestorInvestInfo(
    idea.userId
  );

  return {
    props: {
      idea,
      investor: { ...investor, totalInvestment, totalProfits },
      stockPurchaseInfos,
      stocksWithPrices,
      userPosts: userIdeas,
      userRank,
      rank: userRank,
    },
    revalidate: 6000,
  };
};

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

  @media screen and (max-width: ${mobileWidth}) {
    flex-direction: column;

    & > div {
      width: 100%;
    }
  }
`;

const PostBlock = styled.div`
  position: relative;
  max-width: 72rem;
  width: 100%;
  padding: 3.2rem 1.2rem;
  display: flex;
  flex-direction: column;

  .idea-title {
    ${HeadH1Bold}
    margin-bottom: 1.6rem;
  }
  .idea-info {
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
