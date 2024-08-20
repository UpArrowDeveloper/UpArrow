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

const useIdeaListForIdeaListPage = () => {
  const { data, loading, error } = useQuery(
    ["userListForInvestorListPage"],
    async () => {
      const ideas = await api.idea.get();
      const stocksList = [];
      for (let i = 0; i < ideas.length; i++) {
        const item = ideas[i];
        stocksList.push(
          Promise.all(item.stockIds.map((id) => api.stock.getById(id)()))
        );
      }
      const resStockList = await Promise.all(stocksList);
      const votes = (
        await Promise.all(ideas.map((idea) => api.vote.getByIdeaId(idea._id)()))
      ).map(({ data }) => data);

      const users = await Promise.all(
        ideas.map((idea) => api.user.getById(idea.userId)())
      );

      const itemIncludedIdeas = ideas.map((idea, index) => ({
        ...idea,
        stocks: resStockList[index] || [],
        votes: {
          agreeCount: votes[index]?.filter((vote) => vote.isAgree).length || 0,
          disagreeCount:
            votes[index]?.filter((vote) => !vote.isAgree).length || 0,
        },
        user: users[index],
      }));

      return itemIncludedIdeas;
    }
  );

  return { data: data ? data : [], loading, error };
};

const IdeaModel = { useIdeaList, useIdeaListForIdeaListPage };

export default IdeaModel;
