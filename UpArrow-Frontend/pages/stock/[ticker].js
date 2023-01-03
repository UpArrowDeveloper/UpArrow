import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import styled from '@emotion/styled';
import StockCover from '../../components/StockCover';
import Financials from '../../components/Stock/Financials';
import InvestSimulatorIdeas from '../../components/Stock/InvestSimulatorIdeas';
import Overview from '../../components/Stock/Overview';
import Opinions from '../../components/Stock/Opinions';
import { useAppUser } from '../../hooks/useAppUser';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../apis';

const StockWrapper = styled.div`
  display: flex;
  justify-content: center;

  .section {
    margin-bottom: 3.2rem;
  }
  .stock-content {
    max-width: 128rem;
  }

  .content {
    padding: 0 3rem;

    .button-wrapper {
      display: flex;
      justify-content: center;
      gap: 5rem;
    }
  }

  .financial {
    margin-bottom: 5rem;
  }

  .investor-wrapper {
    display: flex;
    gap: 5rem;
  }

  .buy-sale-btn-group {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 5rem;
    margin-bottom: 10rem;
  }
`;

export default function Stock({ stock, analysis }) {
  const { user, refetch: refetchUser } = useAppUser();
  const [comment, setComment] = useState('');
  const { data: currentStockValuationData, refetch } = useQuery(
    ['currentStockValuation', user, stock],
    (stock && user && api.price.get(stock._id, user._id)) || {}
  );
  const postOrder = useMutation(api.order.post, {
    onSuccess: () => refetch() && refetchUser(),
  });

  const submitComment = async () => {
    if (comment && stock && user) {
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${user.email}/email`
      );
      const data = await response.json();

      const commentJSON = {
        stockId: String(stock._id),
        userId: String(data._id),
        content: comment,
        likes: [],
      };

      try {
        await axios.post('http://localhost:4000/api/v1/comment', commentJSON);
        setCommentJSON(commentJSON);
      } catch (e) {
        console.error('e : ', e);
      } finally {
        setComment('');
      }
    }
  };

  const onBuyClick = (stockOrderQuantity) => {
    postOrder.mutate({
      stockId: stock._id,
      userId: user._id,
      price: stock.currentPrice,
      quantity: stockOrderQuantity,
      type: 'buy',
    });
  };

  const onSellClick = (stockOrderQuantity) => {
    postOrder.mutate({
      stockId: stock._id,
      userId: user._id,
      price: stock.currentPrice,
      quantity: stockOrderQuantity,
      type: 'sell',
    });
  };

  if (!user) return 'please login';
  if (!currentStockValuationData) return 'no stock data';

  return (
    <StockWrapper>
      <div className='stock-content'>
        <StockCover
          stockImageUrl={stock.logoUrl}
          stockCoverImageUrl={stock.backgroundImageUrl}
          stockName={stock.name}
        />
        <InvestSimulatorIdeas
          stock={stock}
          user={user}
          onBuyClick={onBuyClick}
          onSellClick={onSellClick}
          currentStockValuation={currentStockValuationData.price}
          className='section'
        />
        <Overview className='section' />
        <Financials className='section' />
        <Opinions
          className='section'
          comment={comment}
          setComment={setComment}
          submitComment={submitComment}
        />
      </div>
    </StockWrapper>
  );
}

export async function getServerSideProps(context) {
  const ticker = context.query.ticker;
  const stock = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${ticker}/ticker`
    )
  ).data;
  const analysisId = stock.analysisId;
  const analysis = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/analysis/${analysisId}`
    )
  ).data;

  return {
    props: { stock, analysis },
  };
}
