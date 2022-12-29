import React, { useEffect, useState } from 'react';
import { ThumbUpIcon } from '../components/icons';
import { useUser } from '@auth0/nextjs-auth0';
import './Comment.module.css';
import axios from 'axios';
import styled from '@emotion/styled';
import UserIcon from './UserIcon';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Body14Medium, Body16Regular, HeadH6Bold } from '../styles/typography';
import color from '../styles/color';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

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

  .content {
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
`;

const CommentView = ({
  imageUrl,
  username,
  content,
  createdAt,
  likeCount,
  checked,
  onHeartClick,
}) => {
  return (
    <CommentBlock>
      <div className='profile'>
        <div className='picture-wrapper'>
          <UserIcon className='picture' src={imageUrl} />
        </div>
        <div className='content'>
          <div className='user-info'>
            <div className='comment-name'>{username}</div>
            <div className='comment-time'>
              {timeAgo.format(new Date(createdAt))} · {likeCount} Likes
            </div>
          </div>
          <div className='comment-content'>{content}</div>
        </div>
      </div>

      <div className='thumb-up' onClick={onHeartClick}>
        {checked ? (
          <ThumbUpIcon />
        ) : (
          <ThumbUpIcon style={{ fill: color.B40 }} />
        )}
      </div>
    </CommentBlock>
  );
};

const Comment = ({ comment: comment }) => {
  const [username, setUsername] = useState('');
  const [investorProfilePicture, setInvestorProfilePicture] = useState('');
  const [likes, setLikes] = useState(0);
  var uid = '';
  const { user, error, isLoading } = useUser();

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
    const email = localStorage.getItem('email');
    const getUser = async () => {
      const likesList = comment.likes;

      var userResponse = await fetch(
        `http://localhost:4000/api/v1/user/${email}/email`
      );
      var userData = await userResponse.json();
      var userIdString = String(userData._id);
      uid = userIdString;
      var isLiked = false;

      for (var i = 0; i < likesList.length; i++) {
        var userId = String(likesList[i]);
        if (userId == uid) {
          isLiked = true;
        }
      }

      if (isLiked == true) {
        setLikes(comment.likes.length);
        setChecked(true);
      } else {
        setLikes(comment.likes.length);
        setChecked(false);
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/user/${comment.userId}`
      );
      const data = await response.json();
      setUsername(data.username);
      setInvestorProfilePicture(data.profile_image_url);
    };
    getUser();
  }, []);

  const callLikesApi = async () => {
    const commentId = String(comment._id);

    var userResponse = await fetch(
      `http://localhost:4000/api/v1/user/${user.email}/email`
    );
    var userData = await userResponse.json();
    var userIdString = String(userData._id);
    uid = userIdString;

    if (checked == false) {
      const response = await axios.put(
        `http://localhost:4000/api/v1/investor/update/likes/comment/${commentId}/${uid}`,
        {}
      );
      setLikes(response.data.likes.length);
      setChecked(!checked);
    } else {
      const response = await axios.put(
        `http://localhost:4000/api/v1/investor/update/likes/comment/${commentId}/${uid}`,
        {}
      );
      setLikes(response.data.likes.length);
      setChecked(!checked);
    }
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

export default Comment;
