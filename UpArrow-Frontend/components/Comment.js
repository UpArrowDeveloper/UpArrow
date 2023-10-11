import React, { useEffect, useState } from "react";
import { ThumbUpIcon } from "../components/icons";
import "./Comment.module.css";
import axios from "axios";
import styled from "@emotion/styled";
import UserIcon from "./UserIcon";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Body14Medium, Body16Regular, HeadH6Bold } from "../styles/typography";
import color from "../styles/color";
import api from "../apis";
import { useAppUser } from "../hooks/useAppUser";
import { useRouter } from "next/router";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const CommentView = ({
  imageUrl,
  username,
  content,
  createdAt,
  likeCount,
  checked,
  onHeartClick,
}) => {
  const { isMobile } = useMobile();
  return (
    <CommentBlock>
      <div className="profile">
        <div className="picture-wrapper">
          <UserIcon className="picture" src={imageUrl} />
        </div>
        <div className="comment-content-wrapper">
          <div className="user-info">
            <div className="comment-name">{username}</div>
            <div className="comment-time">
              {timeAgo.format(new Date(createdAt))} · {likeCount} Likes
            </div>
          </div>
          <div className="comment-content">{content}</div>
          {isMobile && (
            <div className="thumb-up" onClick={onHeartClick}>
              {checked ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpIcon style={{ fill: color.B40 }} />
              )}
              like
            </div>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="thumb-up" onClick={onHeartClick}>
          {checked ? (
            <ThumbUpIcon />
          ) : (
            <ThumbUpIcon style={{ fill: color.B40 }} />
          )}
        </div>
      )}
    </CommentBlock>
  );
};

const Comment = ({ comment }) => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const [username, setUsername] = useState("");
  const [investorProfilePicture, setInvestorProfilePicture] = useState("");
  const [likes, setLikes] = useState(0);
  const { user } = useAppUser();

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    if (checked == false) {
      setChecked(true);
      setLikes(comment.likes.length);
    } else {
      setChecked(false);
      setLikes(comment.likes.length);
    }
  };

  useEffect(() => {
    const email = user?.email;
    const getUser = async () => {
      if (email) {
        const likesList = comment.likes;

        const user = await api.user.getByEmail(email)();
        const isLiked = likesList.includes(String(user._id));

        setChecked(isLiked);
        setLikes(comment.likes.length);
      }
      if (comment.userId) {
        const data = await api.user.getById(comment.userId)();
        setUsername(data.username);
        setInvestorProfilePicture(data.profileImageUrl);
      }
    };
    getUser();
  }, [user?.email && comment.userId]);

  const callLikesApi = async () => {
    const commentId = String(comment._id);
    const userData = await api.user.getByEmail(user.email)();
    const userId = String(userData._id);
    await api.comment.toggleLike({ commentId, userId })();
    await axios.get(`/api/revalidate/stock/${ticker}`);
    router.reload();
  };

  const onHeartClick = () => {
    handleChange();
    callLikesApi();
  };

  return (
    <CommentView
      imageUrl={investorProfilePicture}
      username={username}
      content={comment.content}
      createdAt={comment.createdAt}
      likeCount={likes}
      onHeartClick={onHeartClick}
      checked={checked}
    />
  );
};

const CommentBlock = styled.div`
  display: flex;
  padding: 0.6rem;
  justify-content: space-between;

  .profile {
    display: flex;
  }

  .picture-wrapper {
    margin-right: 3rem;

    .picture {
      width: 6rem;
      height: 6rem;
    }
  }

  .comment-content-wrapper {
    display: flex;
    flex-direction: column;
    margin-right: 1.6rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .comment-name {
    margin-right: 1.6rem;
    ${HeadH6Bold}
  }

  .comment-content {
    ${Body16Regular}
  }

  .comment-time {
    ${Body14Medium}
    color: ${color.B53}
  }

  .thumb-up {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    padding: 2.4rem;
    cursor: pointer;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .comment-content-wrapper {
      .user-info {
        align-items: flex-start;
        flex-direction: column;
      }
    }

    .picture-wrapper {
      margin-right: 2rem;
      img {
        width: 4rem;
        height: 4rem;
      }
    }

    .thumb-up {
      margin-top: 1.4rem;
      padding: 0;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: ${color.B40};
      gap: 0.4rem;
      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
`;

export default Comment;
