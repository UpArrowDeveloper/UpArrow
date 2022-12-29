import React from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import color from '../styles/color';
import {
  Body12Medium,
  HeadH4Bold,
  HeadH5Bold,
  HeadH6Bold,
} from '../styles/typography';
import Rank from './common/Rank';

const InvestorCardWrapper = styled.div`
  position: relative;
  border: solid 0.1rem ${color.B80};
  width: 22.8rem;
  padding: 2.4rem;
  border-radius: 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  :hover {
    border: 0.1rem solid gray;
  }

  .avatar {
    width: 11rem;
    height: 11rem;
    object-fit: cover;
    border-radius: 99.9rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  .investorImg {
    width: 11rem;
    height: 11rem;
    background-color: gray;
    border-radius: 999px;
  }

  .investorName {
    ${HeadH4Bold}
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0rem;
  }

  .totalProfits {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.6rem;
    & > .label {
      ${Body12Medium};
    }
    & > .amount {
      ${HeadH5Bold};
    }
  }

  .stock-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .stock {
      background-color: ${color.B93};
      width: 100%;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999rem;
      ${Body12Medium};
    }
  }

  .totalAssets {
    color: ${({ totalAssetsTextColor }) => totalAssetsTextColor};
  }
`;

const InvestorCard = ({
  investorId,
  investorAvatar,
  investorName,
  totalInvestment,
  totalProfits,
  totalAssets,
  profitPercentageList,
  rank,
}) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const seeInvestor = () => {
    if (user) {
      router.push(`/investor/${investorId}`);
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <InvestorCardWrapper
      onClick={() => seeInvestor()}
      investorAvatar={investorAvatar}
    >
      <Rank rank={rank} />
      <div className='investorImg'>
        {investorAvatar ? (
          <img className='avatar' alt={investorName} src={investorAvatar} />
        ) : (
          <div className='empty'>empty</div>
        )}
      </div>

      <div className='investorName'>{investorName}</div>
      <div className='totalProfits'>
        <div className='label'>Total Profits</div>
        <div className='amount'>
          ${new Intl.NumberFormat().format(totalProfits)}
        </div>
      </div>
      <div className='stock-wrapper'>
        {profitPercentageList
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 3)
          .map(({ stockName, ticker, percent }) => {
            return (
              <div className='stock' key={ticker}>
                {stockName} {percent}%
              </div>
            );
          })}
      </div>
    </InvestorCardWrapper>
  );
};

export default InvestorCard;
