import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import React from 'react';
import color from '../styles/color';
import { useAppUser } from '../hooks/useAppUser';

const CommentInputBlock = styled.div`
  display: flex;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  padding: 1.6rem;
  background-color: #f7f7f7;
  border-radius: 1.6rem;
  height: 12.8rem;

  & > img {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 99rem;
    margin-right: 1.6rem;
    object-fit: cover;
  }

  & > textarea {
    display: flex;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 2.2rem;
    background-color: transparent;
    border: none;
    flex: 1;
    resize: none;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${color.B53};
    }
  }
`;

const CommentInput = (props) => {
  const { user } = useAppUser();

  return <CommentInputView userUrl={user?.profile_image_url} {...props} />;
};

const CommentInputView = ({
  userUrl,
  value,
  setValue,
  commentInputRef,
  ...props
}) => {
  return (
    <CommentInputBlock {...props}>
      <img src={userUrl} />
      <textarea
        placeholder='Add Comments..'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={commentInputRef}
      />
    </CommentInputBlock>
  );
};

export default CommentInput;
