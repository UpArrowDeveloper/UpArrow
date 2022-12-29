import styled from '@emotion/styled';

const PostBlock = styled.div`
  display: flex;
  padding: 5rem;
  border: 0.1rem solid black;
  gap: 5rem;

  & > img {
    width: 10rem;
  }
`;

export default ({ post, onClick }) => {
  return (
    <PostBlock onClick={onClick}>
      <img src={post.thumbnailImageUrl} />
      <div>
        <div>{post.title}</div>
        <div>Author: {post.username}</div>
        <div>likes : {post.likes.length}</div>
      </div>
    </PostBlock>
  );
};
