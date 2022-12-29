import React, { useEffect, useState } from 'react';
import BioCard from '../components/BioCard';
import PurchaseCard from '../components/PurchaseCard';
import axios from 'axios';
import styled from '@emotion/styled';
import { useConfig } from '../hooks/useConfig';

const InvestorBlock = styled.div`
  padding-top: 2rem;
  padding-left: 2rem;

  .upper-section {
    display: flex;
    margin-bottom: 2rem;
  }

  .avatar img {
    width: 13rem;
    height: 13rem;
    object-fit: cover;
    border-radius: 99.9rem;
    margin-right: 2rem;
  }

  .middle-section {
    margin-bottom: 2rem;
  }

  .purchase-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .post-card {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .text {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
    font-weight: 900;
  }
`;

// -> 한 함수 / 모듈 / 는 한가지 일만 해야한다.  clean code
// Investor : Investor 페이지를 보여주는 일 // 다른 기능들은 다른 파일에서 .

export default function Investor({ portfolioList, allUsersListResponse }) {
  const [investor, setInvestor] = useState(null);
  const { config, loading: configLoading } = useConfig();

  const [postList, setPostList] = useState([]);
  const [purchaseWithStockInfoList, setPurchaseWithStockInfoList] = useState(
    []
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserTotalInvestment, setCurrentUserTotalInvestment] =
    useState(0);

  const getCurrentUserPurchases = async (investorStrId) => {
    const userPurchases = (
      await axios(`http://localhost:4000/api/v1/purchase/${investorStrId}/user`)
    ).data;

    const currentUserPurchaseStockList = await Promise.all(
      userPurchases.map((purchase) => {
        return axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${purchase.stockId}`
        );
      })
    );

    const purchaseWithStockInfos = userPurchases.map((purchase, index) => ({
      ...purchase,
      stock: currentUserPurchaseStockList[index].data,
    }));

    setPurchaseWithStockInfoList(purchaseWithStockInfos);
    const totalInvestment = userPurchases.reduce(
      (acc, purchase) => acc + purchase.averagePrice * purchase.quantity,
      0
    );
    setCurrentUserTotalInvestment(totalInvestment);
  };

  const getInvestor = async (investorStrId) => {
    const userEmail = localStorage.getItem('userTokenEmail');
    if (userEmail) {
      const currentUserResponse = await axios(
        `http://localhost:4000/api/v1/user/${userEmail}/search`
      );
      const currentUserJSON = currentUserResponse.data;
      setCurrentUser(currentUserJSON);
    }
    const investorResponse = await axios(
      `http://localhost:4000/api/v1/user/${investorStrId}`
    );
    setInvestor(investorResponse.data);
  };

  const getPosts = async (investorStrId) => {
    const post = await axios.get(
      `http://localhost:4000/api/v1/post/fetch/all/user/${investorStrId}`
    );
    const postResponse = post.data;
    setPostList(postResponse);
  };

  const renderedPostList = postList.map((post) => {
    return (
      <PostCard
        postImage={post.image_url}
        postTitle={post.title}
        postAuthor={post.userName}
        postDate={post.date}
        postLikes={post.numberLikes}
      />
    );
  });

  const profitList = purchaseWithStockInfoList.map((purchase) => {
    const currentStockPrice = config?.prices?.[purchase.stock.ticker || ''];
    const quantity = purchase.quantity;
    const investedMoney = purchase.quantity * purchase.averagePrice;
    return currentStockPrice * quantity - investedMoney;
  });

  const totalProfits = profitList.reduce((acc, profit) => profit + acc, 0);
  useEffect(() => {
    const investorStrId = localStorage.getItem('investorStrId');
    getInvestor(investorStrId); // called the getInvestor function in useEffect
    getPosts(investorStrId);
    getCurrentUserPurchases(investorStrId);
    const filteredUserList = allUsersListResponse.filter(
      (user) => !(investorStrId !== String(user._id))
    );
    const filteredUserDocument = filteredUserList[0];
    const filteredUserPurchaseList = filteredUserDocument.purchases;
    const filteredInvestorPurchaseList = [];

    for (let i = 0; i < portfolioList.length; i++) {
      const purchaseDoc = portfolioList[i];
      const purchaseDocId = purchaseDoc.purchaseId;
      const purchaseUserId = purchaseDoc.userId;
      for (let j = 0; j < filteredUserPurchaseList.length; j++) {
        const userPurchaseId = String(filteredUserPurchaseList[j]);
        if (
          purchaseUserId == investorStrId &&
          purchaseDocId == userPurchaseId
        ) {
          filteredInvestorPurchaseList.push(purchaseDoc);
        }
      }
    }

    let investorPurchaseList = filteredInvestorPurchaseList;

    let totalUserProfits = 0;
    let totalUserInvestment = 0;
    for (let i = 0; i < investorPurchaseList.length; i++) {
      let totalPurchaseAmount = investorPurchaseList[i].totalInvested;
      totalUserInvestment = totalUserInvestment + totalPurchaseAmount;
      totalUserProfits = investorPurchaseList[i].profit + totalUserProfits;
    }
  }, []);

  const renderedPurchaseList = purchaseWithStockInfoList.map((purchase) => {
    return <PurchaseCard purchase={purchase} />;
  });

  if (!investor) return <></>;

  return (
    <InvestorBlock>
      <div className='upper-section'>
        <div className='avatar'>
          <img alt={investor.username} src={investor.profile_image_url}></img>
        </div>

        <div className='biocard'>
          <BioCard
            investor={investor}
            currentUserJSON={currentUser} // currently logged in user
            getInvestor={getInvestor}
            totalInvestment={currentUserTotalInvestment}
            totalProfits={totalProfits}
          />
        </div>
      </div>
      <div className='middle-section'>
        <div className='text'>{investor.username}'s Portfolio</div>
        <div className='purchase-card'>{renderedPurchaseList}</div>
      </div>

      <div className='bottom-section'>
        <div className='text'>{investor.username}'s Ideas</div>
        <div className='post-card'>{renderedPostList}</div>
      </div>
    </InvestorBlock>
  );
}

export async function getServerSideProps() {
  const getPurchaseList = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/stocks/allpurchases'
  );
  const data = await getPurchaseList.json();
  // a user is getting all purchases in upArrow of all users

  const currentStockPrices = (
    await axios.get('http://localhost:4000/api/v1/config')
  ).data.price;

  const portfolioList = [];
  for (let i = 0; i < data.length; i++) {
    const purchase = data[i]; //purchase becomes one individual purchase document
    const stockId = purchase.stockId; // accessing the stockId of the purchase

    const stockResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${stockId}` // returns a stock doc
    );
    const stock = stockResponse.data; // a stock document

    const purchaseJSON = {
      userId: purchase.userId,
      ticker: stock.ticker,
      logo: stock.profile_image_url,
      quantity: purchase.quantity,
      totalInvested: purchase.totalInvested || 0,
      purchaseId: String(purchase._id),
    };

    if (currentStockPrices) {
      const currentPrice = currentStockPrices[purchaseJSON.ticker];
      const profit =
        purchaseJSON.quantity * currentPrice - purchaseJSON.totalInvested;
      purchaseJSON.profit = profit;
    }
    portfolioList.push(purchaseJSON);
  }

  const allUsersList = await axios.get('http://localhost:4000/api/v1/user');
  const allUsersListResponse = allUsersList.data;

  return {
    props: { portfolioList, allUsersListResponse },
  };
}
