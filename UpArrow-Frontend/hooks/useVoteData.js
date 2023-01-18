import { useQuery } from '@tanstack/react-query';
import api from '../apis';

export const useVoteData = (ideaId) => {
  const { data: voteData } = useQuery(
    ['voteByIdeaId', ideaId],
    api.vote.getByIdeaId(ideaId)
  );
  return {
    voteData,
    agreeCount: voteData?.data.filter((vote) => vote.isAgree).length,
    disagreeCount: voteData?.data.filter((vote) => !vote.isAgree).length,
  };
};
