import { useQuery } from '@tanstack/react-query';
import api from '../apis';

export const useVoteData = (postId) => {
  const { data: voteData } = useQuery(
    ['voteByPostId', postId],
    api.vote.getByPostId(postId)
  );
  return {
    voteData,
    agreeCount: voteData?.data.filter((vote) => vote.isAgree).length,
    disagreeCount: voteData?.data.filter((vote) => !vote.isAgree).length,
  };
};
