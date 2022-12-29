import { useQuery } from '@tanstack/react-query';
import api from '../../apis';

export const usePost = (id) => {
  const { data, isLoading, refetch } = useQuery(
    ['post', id],
    api.post.getById(id)
  );

  return {
    post: data,
    isLoading,
    refetch,
  };
};
