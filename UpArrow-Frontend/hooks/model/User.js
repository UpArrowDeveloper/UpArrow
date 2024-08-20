import { useQuery } from "@tanstack/react-query";
import api from "../../apis";
import { getInvestorInvestInfo } from "../../utils/investor";

const useUserList = () => {
  const { data, loading, error } = useQuery(["userList"], async () => {
    const investorList = await api.user.get();

    const investorProfitPercentageList = await Promise.all(
      investorList.map((investor) =>
        api.user.getProfitPercentageById(investor._id)
      )
    );

    const totalProfitAttached = [];
    for await (const v of investorList) {
      totalProfitAttached.push({
        ...v,
        ...(await getInvestorInvestInfo(v._id)),
      });
    }

    const percentBindDataList = totalProfitAttached.map((investor, index) => {
      return {
        ...investor,
        percentList: investorProfitPercentageList[index],
      };
    });

    return percentBindDataList;
  });

  return { data: data ? data : [], loading, error };
};

const UserModel = { useUserList };

export default UserModel;
