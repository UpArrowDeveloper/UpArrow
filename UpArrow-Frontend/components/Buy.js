import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { numberComma } from '../utils/number';

const BuyWrapper = styled.div`
  font-family: sans-serif;
  font-size: 25px;
  color: white;
  border: 1px ${({ isSale }) => (isSale ? '#ef4232' : '#34aa52')};
  background-color: ${({ isSale }) => (isSale ? '#ef4232' : '#34aa52')};
  width: 260px;
  height: 94.25px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InvisibleCover = styled.div`
  background-color: rgba(0 0 0 / 10%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; //viewportwidth
  height: 100vh; //viewportheight
  z-index: 990;
`;

const ModalWrapper = styled.div`
  font-family: sans-serif;
  font-size: 22px;
  color: black;
  width: 800px;
  height: 800px;
  background-color: white;
  position: fixed;
  left: calc(-400px + 50%);
  top: calc(-400px + 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .stockLogo {
    width: 200px;
    height: 200px;
  }

  .boldText {
    font-weight: bold;
    display: inline;
  }

  .quantity {
    width: 200px;
    height: 50px;
    margin-bottom: 15px;
    text-align: center;
  }

  .button {
    font-family: sans-serif;
    font-size: 25px;
    color: white;
    width: 200px;
    height: 70px;
    border-radius: 5px;
    background-color: ${({ isSale }) => (isSale ? '#ef4232' : '#34aa52')};
    border: 1px ${({ isSale }) => (isSale ? '#ef4232' : '#34aa52')};
    margin-bottom: 15px;
  }

  .error-message {
    font-size: 2.4rem;
    color: red;
  }
`;

const ConfirmationWrapper = styled.div`
  .congratulations {
    font-family: sans-serif;
    font-size: 30px;
    color: Black;
    font-weight: bold;
  }
`;

function Buy({ stockJSON, isSale }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const stock = stockJSON;
  const [user, setUser] = useState(null);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [buy, setBuy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userCurrentStockCount, setUserCurrentStockCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const userEmail = localStorage.getItem('email');
      const response = await axios(
        `http://localhost:4000/api/v1/user/${userEmail}/email`
      );
      const data = response.data;
      setUser(data);
    };
    getUser();
  }, [totalInvestment, stock]);

  useEffect(() => {
    if (stockJSON) {
      getAverageStockPrice();
    }
  }, [stock]);

  const getAverageStockPrice = async () => {
    const response = await axios.get('http://localhost:4000/api/v1/config');
    const currentStockPrices = response.data.prices;
    const currentPrice = currentStockPrices[stockJSON.ticker];
    setCurrentPrice(currentPrice);
  };

  useEffect(() => {
    const getUserPurchases = async () => {
      const userPurchases = (
        await axios(`http://localhost:4000/api/v1/purchase/${user._id}/user`)
      ).data;

      console.log('userPurchases : ', userPurchases);
      const userStock = userPurchases.find(
        (purchase) => purchase.stockId === stock?._id
      );

      setUserCurrentStockCount(userStock?.quantity || 0);
    };
    if (user) {
      getUserPurchases();
    }
  }, [user]);

  const showModal = () => setOpen((s) => !s);

  const purchaseStock = async () => {
    try {
      if (isSale) {
        await axios.put('http://localhost:4000/api/v1/investor/sell', {
          userId: String(user._id),
          stockId: String(stock._id),
          quantity: quantity,
          price: currentPrice,
        });
      } else {
        await axios.post('http://localhost:4000/api/v1/investor/purchase', {
          userId: String(user._id),
          stockId: String(stock._id),
          quantity: quantity,
          price: currentPrice,
        });
      }

      setBuy(true);
      localStorage.setItem('investorStrId', user._id);
      setTimeout(() => {
        router.push('/investor');
        console.log('push to investor');
      }, 5000);
    } catch (error) {
      console.log('redirect error : ', error);
      setErrorMsg(JSON.stringify(error.message));
      return;
    }
  };

  const calculateTotalInvestment = () => {
    const enteredQuantity = quantity;
    const totalInvestment = currentPrice * enteredQuantity;
    setTotalInvestment(totalInvestment);
  };

  return (
    <>
      <BuyWrapper onClick={showModal} isSale={isSale}>
        {isSale ? 'Sale' : 'Buy'}
      </BuyWrapper>

      {open ? (
        <>
          <ModalWrapper isSale={isSale}>
            {!buy ? (
              <>
                <img className='stockLogo' src={stock?.profile_image_url} />
                <p>
                  Stock Name: <div className='boldText'>{stock?.name}</div>
                </p>
                <p>
                  Available stocks to sell :{' '}
                  <div className='boldText'>{userCurrentStockCount}</div>
                </p>
                <p>
                  Current Price:{' '}
                  <div className='boldText'>${numberComma(currentPrice)}</div>
                </p>
                <p className='boldText'>
                  How many shares would you like to {isSale ? 'sell' : 'buy'}
                </p>

                <input
                  type='number'
                  id='quantity'
                  className='quantity'
                  name='quantity'
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button className='button' onClick={calculateTotalInvestment}>
                  Calculate
                </button>

                <p>
                  Total {isSale ? 'Sale' : 'Investment'}:{' '}
                  <div className='boldText'>
                    ${numberComma(totalInvestment)}
                  </div>
                </p>
                <p>
                  Available Cash:{' '}
                  <div className='boldText'>
                    ${numberComma(user?.availableCash)}
                  </div>
                </p>

                <button className='button' onClick={purchaseStock}>
                  {isSale ? 'Sell' : 'Buy'}
                </button>
                <p className='error-message'>{errorMsg}</p>
                <p className='stock-price-disclaimer'>
                  * Current price is the estimated price of the {stock?.name}{' '}
                  stock
                </p>
                <p className='simulation-disclaimer'>
                  * UpArrow is an investment simulator, you are not{' '}
                  {isSale ? 'selling' : 'buying'} the actual {stock?.name} stock
                </p>
              </>
            ) : (
              <ConfirmationWrapper>
                <p className='congratulations'>Congratulations!</p>
                <p className='confirmation-message'>
                  You {isSale ? 'sold ' : 'bought'}{' '}
                  <span className='boldText'>
                    {numberComma(Number(quantity))} shares
                  </span>{' '}
                  of <span className='boldText'>{user.stockName} </span>
                  at{' '}
                  <span className='boldText'>
                    ${numberComma(Number(currentPrice))}!
                  </span>
                </p>
                <p className='remaining-cash'>
                  Remaining Cash:{' '}
                  <span className='boldText'>
                    $
                    {numberComma(
                      isSale
                        ? user.availableCash + Number(quantity) * currentPrice
                        : user.availableCash - Number(quantity) * currentPrice
                    )}
                  </span>
                </p>
                <p className='loading-message'>
                  Redirecting you to your portfolio...
                </p>
              </ConfirmationWrapper>
            )}
          </ModalWrapper>
          <InvisibleCover
            onClick={() => {
              setOpen(false);
            }}
          ></InvisibleCover>
        </>
      ) : null}
    </>
  );
}

export default Buy;
