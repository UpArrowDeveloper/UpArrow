import dynamic from "next/dynamic";
const Logo = dynamic(() => import("../components/Logo"), { ssr: false });
const InvestorCard = dynamic(() => import("../components/InvestorCard"), {
  ssr: false,
});
import IdeaCard from "../components/IdeaCard";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { MainLayout } from "../Layouts";
import { HeadH2Bold, HeadH5Bold } from "../styles/typography";
const PcBanner = dynamic(() => import("../components/common/PcBanner"));
const MobileBanner = dynamic(() => import("../components/common/MobileBanner"));
import api from "../apis";
import { getInvestorInvestInfo } from "../utils/investor";
import { ChevronRightMobileIcon, NextIcon } from "../components/icons";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";
import Skeleton from "react-loading-skeleton";

function Home({
  stockList,
  topSixIdea,
  investorDataList,
  stockRef,
  ideaRef,
  investorRef,
}) {
  const router = useRouter();
  const { isMobile } = useMobile();

  return (
    <IndexWrapper postLength={topSixIdea.length}>
      <div className="main-items">
        <div className="header-wrapper">
          <div
            className="text"
            ref={stockRef}
            onClick={() => router.push("/stock")}
          >
            Stocks
          </div>
          {isMobile ? (
            <ChevronRightMobileIcon onClick={() => router.push("/stock")} />
          ) : (
            <NextIcon onClick={() => router.push("/stock")} />
          )}
        </div>
        <div className="stockList">
          {stockList?.slice(0, 100).map((data) => {
            return (
              <Logo
                key={data.name}
                logoUrl={data.logoUrl}
                onClick={() => router.push(`/stock/${data.ticker}`)}
                isMobile={isMobile}
              />
            );
          }) || <Skeleton height={72} width={72} />}
        </div>
      </div>
      <div className="main-items">
        <div className="header-wrapper">
          <div className="text" ref={ideaRef}>
            Ideas
          </div>
          {isMobile ? (
            <ChevronRightMobileIcon onClick={() => router.push("/idea")} />
          ) : (
            <NextIcon onClick={() => router.push("/idea")} />
          )}
        </div>

        <div className="ideaList">
          {topSixIdea.map((idea) => {
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
          })}
        </div>
      </div>

      <div className="main-items">
        <div className="header-wrapper">
          <div className="text" ref={investorRef}>
            Investors
          </div>
          {isMobile ? (
            <ChevronRightMobileIcon onClick={() => router.push("/investor")} />
          ) : (
            <NextIcon onClick={() => router.push("/investor")} />
          )}
        </div>

        <div className="investorList">
          {investorDataList.slice(0, 10).map((investor, index) => {
            return (
              <InvestorCard
                key={investor._id}
                investorId={investor._id}
                investorName={investor.name}
                investorAvatar={investor.profileImageUrl}
                totalInvestment={investor.totalInvestment}
                totalProfits={investor.totalProfits}
                totalAssets={investor.totalAssets}
                profitPercentageList={investor.percentList}
                rank={index + 1}
              />
            );
          })}
        </div>
      </div>
    </IndexWrapper>
  );
}

export async function getStaticProps() {
  const stockList = await api.stock.get();
  const investorList = await api.user.get();
  const config = await api.config.get();
  const banner = await api.banner.get();
  const topSixIdea = await api.idea.get({
    params: {
      order: "desc",
      limit: 6,
    },
  });
  const userAddedTopSixIdea = [];

  for await (const v of topSixIdea) {
    const username = (await api.user.getById(v.userId)()).username;
    userAddedTopSixIdea.push({
      ...v,
      username,
    });
  }

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

  percentBindDataList.sort((a, b) => {
    const x = a.totalProfits;
    const y = b.totalProfits;

    if (x === 0 && y === 0) return 1 / y - 1 / x || 0;
    else return y - x;
  });

  return {
    props: {
      stockList,
      topSixIdea: userAddedTopSixIdea,
      investorDataList: percentBindDataList,
      config,
      banner,
    },
    revalidate: 60 * 10, // In seconds
  };
}

export default function MainPage(props) {
  const { isMobile } = useMobile();
  return (
    <>
      {isMobile ? <MobileBanner /> : <PcBanner />}
      <MainLayout isMain>
        <Home {...props} />
      </MainLayout>
    </>
  );
}

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

  .ideaList {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;
    gap: 3.6rem;
    row-gap: 2.4rem;

    /* & > div {
      &:not(
          :nth-last-child(-n + ${({ postLength }) => (postLength % 2 ? 1 : 2)})
        ) {
        border-bottom: 0.1rem solid #d9d9d9;
      }
    } */
  }

  .investorList {
    display: flex;
    flex-wrap: wrap;
    gap: 1.8rem;
  }

  .header-wrapper {
    display: flex;
    justify-content: space-between;
  }

  @media screen and (max-width: ${mobileWidth}) {
    .main-items {
      padding: 2rem;

      .text {
        ${HeadH5Bold}
      }

      .stockList {
        gap: 1.6rem;
        min-height: 10.7rem;

        & > img {
          width: 7.2rem;
          height: 7.2rem;
        }
      }

      &:first-child {
        border-top: 0.5px solid rgba(0, 0, 0, 0.1);
      }
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
    }

    .investorList {
    }
  }
`;
