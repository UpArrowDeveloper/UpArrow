import styled from '@emotion/styled';
import Comment from './Comment';

const CommentListBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const CommentListView = ({ comments, ...props }) => {
  return (
    <CommentListBlock {...props}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </CommentListBlock>
  );
};

const CommentList = ({ comments, ...props }) => {
  return <CommentListView comments={comments} {...props} />;
};

export default CommentList;
