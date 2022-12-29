import { WorkOutlined } from '@mui/icons-material';
import * as React from 'react';
import styled from '@emotion/styled';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useConfig } from '../hooks/useConfig';
import { useRouter } from 'next/router';

const PurchaseBlock = styled.div`
  border: solid 0.1rem #dee0e3;
  box-shadow: 0rem 0rem 0.2rem #c4c7cc;
  width: 27rem;
  height: 12rem;
  display: flex;

  .picture img {
    border: solid 0.1rem #dee0e3;
    box-shadow: 0rem 0rem 0.2rem #c4c7cc;
    width: 10rem;
    height: 10rem;
    margin-left: 1rem;
    margin-top: 1rem;
  }

  .ticker {
    margin-left: 2rem;
    margin-top: 1rem;
    font-weight: bold;
  }

  .shares {
    margin-left: 2rem;
    margin-top: 1rem;
    font-weight: bold;
  }

  .profits {
    margin-left: 1.5rem;
    margin-top: 1rem;
    font-weight: bold;
  }
`;

const PurchaseCard = ({ purchase }) => {
  const { _id, userId, stockId, stock, quantity, averagePrice } = purchase;
  const {
    config: { prices },
  } = useConfig();
  const router = useRouter();
  const profits = (prices?.[stock.ticker] - averagePrice) * quantity;
  const profitTextColor = profits >= 0 ? 'green' : 'red';
  const profitArrow =
    profits >= 0 ? (
      <ArrowUpwardRoundedIcon color='success' />
    ) : (
      <ArrowDownwardRoundedIcon color='error' />
    );

  return (
    <PurchaseBlock
      onClick={() => {
        router.push(`/stock/${stock.ticker}`);
      }}
    >
      <div className='picture'>
        <img src={stock.profile_image_url}></img>
      </div>

      <div className='purchaseInfo'>
        <div className='ticker'>{stock.ticker}</div>

        <div className='shares'>{quantity} Shares</div>

        <div className='profits'>
          <p style={{ color: `${profitTextColor}` }}>
            {profitArrow}{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(profits)}
          </p>
        </div>
      </div>
    </PurchaseBlock>
  );
};

export default PurchaseCard;
