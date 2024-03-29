import styled from "@emotion/styled";
import { mobileWidth } from "../styles/responsive";
import { HeadH3Bold } from "../styles/typography";

const StockCoverWrapper = styled.div`
  position: relative;
  height: 32.6rem;
  margin-bottom: 5rem;
  .empty-cover-img {
    height: 21.4rem;
    width: 100%;
  }
  .cover-img {
    height: 21.4rem;
    width: 100%;
    object-fit: cover;
  }

  .stock-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 3.2rem;
    bottom: 0rem;
    .stock-img {
      width: 12rem;
      height: 12rem;
      margin-right: 2rem;
      border-radius: 999rem;
      margin-bottom: 1.2rem;
    }
    .stock-name {
      font-size: 4rem;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    margin-bottom: 0;
    .stock-info {
      bottom: 3.2rem;

      .stock-img {
        width: 7.2rem;
        height: 7.2rem;
      }

      .stock-name {
        ${HeadH3Bold}
      }
    }
  }
`;

const StockCover = ({ stockImageUrl, stockCoverImageUrl, stockName }) => {
  return (
    <StockCoverWrapper>
      {stockCoverImageUrl ? (
        <img className="cover-img" src={stockCoverImageUrl} />
      ) : (
        <div className="empty-cover-img"></div>
      )}
      <div className="stock-info">
        <img
          className="stock-img"
          src={stockImageUrl}
          width="230"
          height="230"
        />
        <h1 className="stock-name">{stockName}</h1>
      </div>
    </StockCoverWrapper>
  );
};
export default StockCover;
