import { useQuery } from '@tanstack/react-query';
import api from '../../apis';

export const useIdea = (id) => {
  const { data, isLoading, refetch } = useQuery(
    ['idea', id],
    api.idea.getById(id)
  );

  return {
    idea: data,
    isLoading,
    refetch,
  };
};
