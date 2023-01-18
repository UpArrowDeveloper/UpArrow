import Logo from '../components/Logo';
import IdeaCard from '../components/IdeaCard';
import InvestorCard from '../components/InvestorCard';
import styled from '@emotion/styled';
import axios from 'axios';
import { useRouter } from 'next/router';
import { MainLayout } from '../Layouts';
import { HeadH2Bold } from '../styles/typography';
import Banner from '../components/common/Banner';
import api from '../apis';

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
  stockList,
  topSixIdea,
  investorDataList,
  stockRef,
  ideaRef,
  investorRef,
}) {
  const router = useRouter();

  const logoList = stockList.slice(0, 14).map((data) => {
    return <Logo key={data._id} logoUrl={data.logoUrl} />;
  });

  const postList = topSixIdea.map((idea) => {
    return (
      <IdeaCard
        key={idea._id}
        ideaId={idea._id}
        ideaImage={idea.thumbnailImageUrl}
        ideaTitle={idea.title}
        ideaAuthor={idea.username}
        ideaDate={idea.date}
        ideaStockIds={idea.stockIds}
      />
    );
  });

  const topTenRenderedInvestorList = investorDataList
    .slice(0, 10)
    .map((investor, index) => {
      return (
        <InvestorCard
          key={investor._id}
          investorName={investor.name}
          investorAvatar={investor.profileImageUrl}
          totalInvestment={investor.totalInvestment}
          totalProfits={investor.totalProfits}
          totalAssets={investor.totalAssets}
          profitPercentageList={investor.percentList}
          rank={index + 1}
        />
      );
    });

  return (
    <IndexWrapper postLength={topSixIdea.length}>
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
  const stockList = await api.stock.get();
  const topSixIdea = await api.idea.get({
    params: {
      order: 'desc',
      limit: 6,
    },
  });

  const investorList = await api.user.get();

  const investorProfitPercentageList = await Promise.all(
    investorList.map((investor) =>
      api.user.getProfitPercentageById(investor._id)
    )
  );
  // TODO: percent null 인데 이유 찾기
  console.log('investorProfit : ', investorProfitPercentageList);
  const percentBindDataList = investorList.map((investor, index) => {
    return {
      ...investor,
      percentList: investorProfitPercentageList[index],
    };
  });

  percentBindDataList.sort((a, b) => {
    const x = a.totalProfits;
    const y = b.totalProfits;

    if (x === 0 && y === 0) return 1 / y - 1 / x || 0;
    else return y - x;
  });

  return {
    props: {
      stockList,
      topSixIdea,
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
