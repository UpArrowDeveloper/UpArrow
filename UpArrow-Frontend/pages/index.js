import Logo from '../components/Logo';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import InvestorCard from '../components/InvestorCard';
import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { MainLayout } from '../Layouts';
import { HeadH2Bold } from '../styles/typography';
import Banner from '../components/common/Banner';
import stock from '../apis/stock';

const IndexWrapper = styled.div`
  margin-bottom: 5rem;

  .text {
    ${HeadH2Bold}
    margin-bottom: 2.4rem;
  }

  .main-items {
    padding: 3.2rem;
  }

  .stockList {
    display: flex;
    flex-wrap: wrap;
    gap: 2.4rem 4.2rem;
    padding-bottom: 3.2rem;
  }

  .postList {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;

    & > div {
      &:not(
          :nth-last-child(-n + ${({ postLength }) => (postLength % 2 ? 1 : 2)})
        ) {
        border-bottom: 0.1rem solid #d9d9d9;
      }
    }
  }

  .investorList {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

function Home({
  sortedStockDataList,
  postDataList,
  investorDataList,
  stockRef,
  ideaRef,
  investorRef,
}) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const email = user.email;

        const userDocument = await axios
          .get(`http://localhost:4000/api/v1/user/${email}/email`)
          .catch((error) => {
            console.log('error', error.response);
            if (error.response.status == 400 || error.response.status == 404) {
              console.log(error.response.data); // => the response payload
              return error.response.data;
            }
          });

        localStorage.setItem(
          'profile_image_url',
          userDocument.data.profile_image_url
        );
        if (Object.keys(userDocument.data).length == 0) {
          router.push('/signup');
        }
      }
    };
    getUser();
  }, [user]);

  const logoList = sortedStockDataList.slice(0, 14).map((data, index) => {
    return <Logo key={index} stockJSON={data} />;
  });

  const postList = postDataList.map((post) => {
    return (
      <PostCard
        key={post.title}
        postId={post._id}
        postImage={post.thumbnailImageUrl}
        postTitle={post.title}
        postAuthor={post.username}
        postDate={post.date}
        postLikes={post.likes.length}
        stockId={post.stockId}
      />
    );
  });

  const topTenRenderedInvestorList = investorDataList
    .slice(0, 10)
    .map((investor, index) => {
      return (
        <InvestorCard
          key={investor._id}
          investorId={investor._id}
          investorName={investor.name}
          investorAvatar={investor.profile_image_url}
          totalInvestment={investor.totalInvestment}
          totalProfits={investor.totalProfits}
          totalAssets={investor.totalAssets}
          profitPercentageList={investor.percentList}
          rank={index + 1}
        />
      );
    });

  let options = [];
  let valueCount = 0;

  for (let i = 0; i < sortedStockDataList.length; i++) {
    let labelJSON = {};
    valueCount++;
    labelJSON['value'] = valueCount;
    labelJSON['label'] = sortedStockDataList[i].name;
    labelJSON['stockId'] = String(sortedStockDataList[i]._id);
    options.push(labelJSON);
  }

  return (
    <IndexWrapper postLength={postDataList.length}>
      <div className='main-items'>
        <div
          className='text'
          ref={stockRef}
          onClick={() => router.push('/stock')}
        >
          Stocks
        </div>
        <div className='stockList'>{logoList}</div>
      </div>
      <div className='main-items'>
        <div className='text' ref={ideaRef}>
          Ideas
        </div>
        <div className='postList'>{postList}</div>
      </div>

      <div className='main-items'>
        <div className='text' ref={investorRef}>
          Investors
        </div>
        <div className='investorList'>{topTenRenderedInvestorList}</div>
      </div>
    </IndexWrapper>
  );
}

export async function getServerSideProps() {
  const allStockList = await axios(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/stock`
  );
  // getting all stocks available on UpArrow (a user at the landing page where all stocks are)
  const allStockDataList = allStockList.data;

  const sortedStockDataList = allStockDataList.sort((stock1, stock2) => {
    return stock2.invest.length - stock1.invest.length;
  });
  // making all stock data in alphabetical order

  const topSixPost = await axios('http://localhost:4000/api/v1/post', {
    params: {
      order: 'desc',
      limit: 6,
    },
  });
  const postDataList = topSixPost.data;
  // a user is getting top 6 posts (on index.js)

  // 10번
  // 10번을 동시에 할수도 있고선 6차선
  // 10 번을 순서대로 할 수도 있음
  // 4차선 <
  // 1차선
  const investorList = await axios(
    'http://localhost:4000/api/v1/user' // this api gets all investors in upArrow
  );
  const investorDataList = investorList.data; // investorDataList gets user document of all users in UpArrow

  const investorProfitPercentageList = (
    await Promise.all(
      investorDataList.map((investor) =>
        axios(
          `http://localhost:4000/api/v1/user/${investor._id}/profit-percentage`
        )
      )
    )
  ).map(({ data }) => data);
  const percentBindDataList = investorDataList.map((investor, index) => {
    return {
      ...investor,
      percentList: investorProfitPercentageList[index],
    };
  });

  percentBindDataList.sort(function (a, b) {
    const x = a.totalProfits;
    const y = b.totalProfits;

    if (x === 0 && y === 0) return 1 / y - 1 / x || 0;
    else return y - x;
  });

  return {
    props: {
      sortedStockDataList,
      postDataList,
      investorDataList: percentBindDataList,
    },
  };
}

export default function MainPage(props) {
  return (
    <>
      <Banner />
      <MainLayout>
        <Home {...props} />
      </MainLayout>
    </>
  );
}
