import React, { useEffect, useState, useRef, Fragment } from 'react';
import Comment from '../../components/Comment';
import { useUser } from '@auth0/nextjs-auth0';
import axios from 'axios';
import styled from '@emotion/styled';
import Buy from '../../components/Buy';
import StockCover from '../../components/StockCover';
import StockChart from '../../components/StockChart';
import Analyses from '../../components/Analysis';
import StarRating from '../../components/StarRating';
import Management from '../../components/Management';
import Financials from '../../components/Stock/Financials';
import UserIcon from '../../components/UserIcon';
import { useRouter } from 'next/router';
import CommentInput from '../../components/CommentInput';
import InvestSimulatorIdeas from '../../components/Stock/InvestSimulatorIdeas';
import Overview from '../../components/Stock/Overview';
import Opinions from '../../components/Stock/Opinions';

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
let token;

export default function Stock({ stockData }) {
  const { query } = useRouter();
  const [comments, setComments] = useState([]);
  const [commentJSON, setCommentJSON] = useState(null);
  const [userId, setUserId] = useState('');
  const [stock, setStock] = useState(null);
  const [filteredStock, setFilteredStock] = useState(null);
  const { user, error, isLoading } = useUser();
  const [openInvest, setOpenInvest] = useState(false);
  const [openNotInvest, setOpenNotInvest] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [comment, setComment] = useState('');

  const fetchInvestors = async () => {
    const investorIdList =
      stock.detailInfo.find((info) => info.type === 'investors')?.content || [];
    const investorList = await Promise.all(
      investorIdList.map((id) =>
        axios.get(`http://localhost:4000/api/v1/user/${id}`)
      )
    );
    setInvestors(investorList.map((item) => item.data));
  };
  useEffect(() => {
    if (stock) {
      fetchInvestors();
    }
  }, [stock]);

  useEffect(() => {
    const stockJSONIdStr = query.ticker;
    const filteredStockList = stockData.filter(
      (stock) => !(stockJSONIdStr !== String(stock._id))
    );
    const filteredStock = filteredStockList[0];
    setFilteredStock(filteredStock);

    const getStockJSON = async () => {
      const stockResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${stockJSONIdStr}/ticker`
      );
      const stockData = await stockResponse.json();
      setStock(stockData);

      const ticker = stockData.ticker;
      try {
        const analysisResponse = await axios.get(
          `http://localhost:4000/api/v1/investor/fetch/analysis/${ticker}`
        );
        setAnalysis(analysisResponse.data);
      } catch (err) {
        console.log('error');
      }
    };
    getStockJSON();

    const getStockComments = async () => {
      const response = await axios(
        `http://localhost:4000/api/v1/comment/${stockJSONIdStr}/stock`
      );
      setComments(response.data);
    };
    getStockComments();

    const getUserId = async () => {
      if (user) {
        token = user;
        const userEmail = user.email;
        const response = await fetch(
          `http://localhost:4000/api/v1/user/${userEmail}/email`
        );
        const data = await response.json();
        setUserId(String(data._id));
      }
    };
    getUserId();
  }, [commentJSON]);

  let stockChartUrl = '';
  let stockTicker = '';
  let totalVotes = 0;
  let starScore = 0;
  let stockName = '';
  let stockImageUrl = '';
  let investedVotes = 0;
  let stockVideoUrl = '';
  let stockPros;
  let stockCons;
  let hasArgument;
  let totalVotesMessage = '';
  let hasVideo = false;
  let messageLabel;
  let coverImageUrl = '';
  if (stock) {
    stockName = stock.name;
    stockVideoUrl = stock.video_url;
    stockPros = stock.pros;
    stockCons = stock.cons;
    stockImageUrl = stock.profile_image_url;
    coverImageUrl = stock.cover_image_url;
    stockTicker = stock.ticker.toUpperCase();
    totalVotes = stock.invest.length + stock.notInvest.length;
    investedVotes = stock.invest.length;
    starScore = (stock.invest.length / totalVotes / 2) * 10;
    stockChartUrl = `https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=8C5CD6B07F444FEEA5F9D26F4361B0B7&symbol=${stockTicker}&dividends=true&splits=true&palette=Financial-Light&showLogo=No`;
    totalVotesMessage = investedVotes + ' invested';
    if (totalVotes === 0) {
      starScore = 0;
    }
    hasVideo = stock.video_url.length > 0;
    hasArgument = stock.pros.length >= 5 && stock.cons.length >= 5;
    messageLabel = `What do you think about ${stock.name} stocks?`;
  }

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

  const handleCloseInvest = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenInvest(false);
  };

  const handleNotCloseInvest = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenNotInvest(false);
  };

  return (
    <StockWrapper>
      <div className='stock-content'>
        <StockCover
          stockImageUrl={stockImageUrl}
          stockCoverImageUrl={coverImageUrl}
          stockName={stockName}
        />
        <InvestSimulatorIdeas className='section' />
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

export async function getServerSideProps() {
  const stockResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/stock`
  );
  const stockData = stockResponse.data;

  return {
    props: { stockData },
  };
}
