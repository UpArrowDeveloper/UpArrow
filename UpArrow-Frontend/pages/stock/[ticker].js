import React, { useState } from 'react';
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
    api.price.get(stock?._id, user?._id),
    { enabled: !!(stock?._id && user?._id) }
  );

  const { data: ideaList } = useQuery(
    ['ideaList', stock?.ideaIds],
    api.idea.getByIds(stock.ideaIds.join(',')),
    { enabled: stock?.ideaIds?.length > 0 }
  );

  const { data: analysisIdeaList } = useQuery(
    ['analysisIdeaList', stock?.ideaIds],

    api.idea.getByIds(analysis.ideaIds.join(',')),
    { enabled: analysis?.ideaIds?.length > 0 }
  );

  const { data: comments, refetch: refetchComments } = useQuery(
    ['stockComments', stock._id],
    (stock._id && api.comment.getByStockId(stock._id)) || []
  );

  const postOrder = useMutation(api.order.post, {
    onSuccess: () => refetch() && refetchUser(),
  });

  const submitComment = async () => {
    if (comment && stock && user?.email) {
      const data = await api.user.getByEmail(user.email)();

      try {
        await api.comment.post({
          stockId: String(stock._id),
          userId: String(data._id),
          content: comment,
          likes: [],
        })();
        refetchComments();
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
          ideaList={ideaList || []}
          onBuyClick={onBuyClick}
          onSellClick={onSellClick}
          currentStockValuation={currentStockValuationData.price}
          className='section'
        />
        <Overview
          className='section'
          analysis={analysis}
          analysisIdeaList={analysisIdeaList || []}
        />
        <Financials className='section' analysis={analysis} />
        <Opinions
          analysis={analysis}
          className='section'
          comment={comment}
          setComment={setComment}
          comments={comments || []}
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
