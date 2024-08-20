import { useQuery } from "@tanstack/react-query";
import api from "../../apis";

const useIdeaList = ({ order, limit }) => {
  const { data, loading, error } = useQuery(
    ["ideaList", order, limit],
    async () => {
      const response = await api.idea.get({
        params: {
          order: "desc",
          limit: 6,
        },
      });
      return response;
    }
  );

  return { data: data ? data : [], loading, error };
};

const IdeaModel = { useIdeaList };

export default IdeaModel;
