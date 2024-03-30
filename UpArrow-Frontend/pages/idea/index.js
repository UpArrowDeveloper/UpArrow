import styled from "@emotion/styled";
import TimeAgo from "javascript-time-ago";
import { useRouter } from "next/router";
import React, { useState } from "react";
import api from "../../apis";
import Viewmore from "../../components/common/Viewmore";
import IdeaVote from "../../components/IdeaVote";
import OrderChip from "../../components/OrderChip";
import { commonListCss, commonTableCss } from "../../styles/table";
import en from "javascript-time-ago/locale/en";
import Image from "next/image";
import { TagGroup } from "../../components/Tag";
import { Body14Regular, HeadH5Bold } from "../../styles/typography";
import color from "../../styles/color";
import { MainLayout } from "../../Layouts";
import { useMobile } from "../../hooks/useMobile";
import IdeaCard from "../../components/IdeaCard";
import { mobileWidth } from "../../styles/responsive";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const orderOptions = ["Popular", "Trending", "Latest"];

const getSortAlgorithmByOrderOption = (orderOption) => {
  switch (orderOption) {
    case "Popular":
      return (a, b) => b.commentIds.length - a.commentIds.length;
    case "Trending":
      return (a, b) => b.votes.agreeCount - a.votes.agreeCount;
    case "Latest":
      return (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    default:
      return (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
};

function Ideas({ ideas }) {
  const [orderOption, setOrderOption] = useState();
  const router = useRouter();
  const { isMobile } = useMobile();

  return (
    <IdeasBlock>
      <header>
        <h1>Ideas</h1>
      </header>
      <nav className="order-option-wrapper">
        {orderOptions.map((order) => (
          <OrderChip
            key={order}
            selected={order === orderOption}
            onClick={() => setOrderOption(order)}
            order={order}
          />
        ))}
      </nav>
      {!isMobile && (
        <div className="table-wrapper">
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
              {ideas
                ?.sort(getSortAlgorithmByOrderOption(orderOption))
                ?.map((idea) => (
                  <tr
                    key={idea._id}
                    onClick={() => router.push(`/idea/${idea._id}`)}
                  >
                    <td className="title-wrapper-fill">
                      <div className="title wrapper">
                        <div className="image-container">
                          <div className="image-wrapper">
                            <Image
                              src={idea.thumbnailImageUrl}
                              layout="fill"
                              objectFit="cover"
                              alt={idea.title}
                            />
                          </div>
                        </div>
                        <div className="title-author">
                          <h5>{idea.title}</h5>
                          <div className="author">
                            by {idea.user.username} ·{" "}
                            {timeAgo.format(new Date(idea.updatedAt))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="wrapper tagwrapper">
                        <TagGroup
                          tags={idea.stocks.map(({ name }) => ({ name }))}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="comments wrapper">
                        {idea.commentIds.length}
                      </div>
                    </td>
                    <td>
                      <div className="idea-vote wrapper">
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
      )}
      {isMobile && (
        <div className="mobile-idea-wrapper">
          {ideas
            ?.sort(getSortAlgorithmByOrderOption(orderOption))
            ?.map((idea) => (
              <IdeaCard
                key={idea._id}
                ideaId={idea._id}
                ideaImage={idea.thumbnailImageUrl}
                ideaTitle={idea.title}
                ideaAuthor={idea.user.username}
                ideaDate={idea.date}
                ideaLikes={idea.likes?.length || 0}
                ideaStockIds={idea.stockIds}
              />
            ))}
        </div>
      )}
      {!isMobile && (
        <div className="view-more-wrapper">
          <Viewmore className="view-more" />
        </div>
      )}
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

export async function getStaticProps() {
  const ideas = await api.idea.get();
  const stocksList = [];
  for (let i = 0; i < ideas.length; i++) {
    const item = ideas[i];
    stocksList.push(
      Promise.all(item.stockIds.map((id) => api.stock.getById(id)()))
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
    }

    .wrapper {
      height: 11.2rem;
      vertical-align: middle;
    }

    .tagwrapper {
      max-width: 24rem;
      min-width: 12rem;
      padding: 0 2rem 0 0;
    }

    .image-container {
      padding-right: 1.6rem;
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

    .image-wrapper {
      width: 8rem;
      height: 8rem;
      img {
        border-radius: 0.8rem;
      }
    }

    .comments {
      font-style: normal;
      font-weight: 500;
      font-size: 1.6rem;
      line-height: 2.2rem;
      min-width: 13.6rem;
    }

    .title-wrapper-fill {
      width: 100%;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .mobile-idea-wrapper {
      display: flex;
      flex-direction: column;
      margin: 0 2rem;
      gap: 1.6rem;
      margin-bottom: 4rem;
    }
  }
`;
