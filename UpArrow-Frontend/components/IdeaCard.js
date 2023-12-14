import React from "react";
import styled from "@emotion/styled";
import en from "javascript-time-ago/locale/en";
import { useQuery } from "@tanstack/react-query";
import api from "../apis";
import { useRouter } from "next/router";
import { useVoteData } from "../hooks/useVoteData";
import Tag from "./common/Tag";
import IdeaVote from "./IdeaVote";
import { Body14Regular, HeadH4Bold, HeadH6Bold } from "../styles/typography";
import color from "../styles/color";
import TimeAgo from "javascript-time-ago";
import { mobileWidth } from "../styles/responsive";
import Image from "next/image";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

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
    ["ideaStockIds", ideaStockIds],
    api.stock.getByIds(ideaStockIds),
    { enabled: ideaStockIds?.length > 0 }
  );
  const { agreeCount, disagreeCount } = useVoteData(ideaId);

  return (
    <IdeaWrapper theme={theme} onClick={() => router.push(`/idea/${ideaId}`)}>
      <div className="image">
        {ideaImage ? (
          <ImgWrapper>
            <Image
              alt="idea-card-image"
              src={ideaImage}
              width={120}
              height={120}
            />
          </ImgWrapper>
        ) : null}
      </div>

      <div className="textBlock">
        <div className="title">{ideaTitle}</div>
        <div className="author">
          by {ideaAuthor} · {timeAgo.format(new Date(ideaDate))}
        </div>
        <div className="tag-wrapper">
          {data?.map((stock) => (
            <Tag key={stock._id}>{stock.name}</Tag>
          ))}
        </div>
        <IdeaVote agreeCount={agreeCount} disagreeCount={disagreeCount} />
      </div>
    </IdeaWrapper>
  );
};

export default IdeaCard;

const IdeaWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 58rem;
  gap: 2rem;
  cursor: pointer;

  .textBlock {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.4rem;

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

  @media screen and (max-width: ${mobileWidth}) {
    align-items: flex-start;
    &:hover {
      border-radius: 1.6rem;
      background-color: rgba(5, 5, 5, 0.03);
    }

    .textBlock {
      gap: 0;

      .title {
        ${HeadH6Bold}
      }

      .author {
        margin-bottom: 0.8rem;
      }
    }

    .tag-wrapper {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.8rem;
      & > div {
        width: auto;
        height: 2.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const ImgWrapper = styled.div`
  position: relative;
  width: 12rem;
  height: 12rem;
  @media screen and (max-width: ${mobileWidth}) {
    width: 8rem;
    height: 8rem;
  }
  img {
    margin: auto;
    display: block;

    object-fit: cover;
    border-radius: 0.8rem;
  }
`;
