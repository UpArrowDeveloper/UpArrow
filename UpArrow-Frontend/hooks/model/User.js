import { useQuery } from "@tanstack/react-query";
import api from "../../apis";
import { getInvestorInvestInfo } from "../../utils/investor";

const useUserList = () => {
  const { data, loading, error } = useQuery(["userList"], async () => {
    const investorList = await api.user.joinAndGet();

    return investorList;
  });

  return { data: data ? data : [], loading, error };
};

const UserModel = { useUserList };

export default UserModel;
