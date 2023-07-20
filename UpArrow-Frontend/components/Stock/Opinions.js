import styled from "@emotion/styled";
import Image from "next/image";
import { useState } from "react";
import color from "../../styles/color";
import {
  Body14Medium,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../styles/typography";
import CommentInput from "../CommentInput";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import CommentList from "../CommentList";
import { mobileWidth } from "../../styles/responsive";

const OpinionCard = ({ authorImageUrl, author, message }) => {
  return (
    <OpinionCardBlock>
      <div className="opinion-card-image-wrapper">
        <Image
          src={authorImageUrl}
          layout="fill"
          className="opinion-author-image"
        />
      </div>
      <div className="author">{author} says</div>
      <div className="message">{message}</div>
    </OpinionCardBlock>
  );
};

const Opinions = ({
  comment,
  setComment,
  submitComment,
  analysis,
  comments,
  ...restProps
}) => {
  const opinionCards = analysis.opinions;
  const [index, setIndex] = useState(0);

  const increaseIndex = () => {
    setIndex((i) => (i < opinionCards.length - 1 ? i + 1 : i));
  };
  const decreaseIndex = () => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  };

  return (
    <OpinionsBlock {...restProps} index={index} cardWidth={52 + 2.4}>
      <h3>Opinions</h3>
      <div className="opinion-cards">
        <div className="left-button" onClick={decreaseIndex}>
          <ChevronLeftIcon />
        </div>
        <div className="opinion-cards-outer-wrapper">
          <div className="opinion-cards-wrapper">
            {opinionCards?.map((card) => (
              <OpinionCard {...card} />
            ))}
          </div>
        </div>
        <div className="right-button" onClick={increaseIndex}>
          <ChevronRightIcon />
        </div>
      </div>

      <CommentList className="comment-list" comments={comments} />
      <div className="comment-wrapper">
        <CommentInput value={comment} setValue={setComment} />
        <button className="comment-submit-btn" onClick={submitComment}>
          Comment
        </button>
      </div>
    </OpinionsBlock>
  );
};

const OpinionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;

  & > div {
    width: 100% !important;
  }

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
      z-index: 50;
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
      z-index: 50;
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

  @media screen and (max-width: ${mobileWidth}) {
    padding: 0;
    border: 0;

    h3 {
      ${HeadH5Bold}
    }
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

  .opinion-author-image {
    border-radius: 999rem;
    object-fit: cover;
  }

  @media screen and (max-width: ${mobileWidth}) {
    width: 100%;

    .author {
      ${Body14Medium}
    }

    .message {
      ${HeadH5Bold}
    }
  }
`;

export default Opinions;
