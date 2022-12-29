import React, { useState } from 'react';
import styled from '@emotion/styled';
import color from '../styles/color';
import Image from 'next/image';
import { ChevronBottomIcon } from '../components/icons';

const PrinciplesBlock = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: ${color.UpArrow_Blue};
`;

const PrincipleCardBlock = styled.div`
  position: fixed;
  top: ${({ index }) => {
    return `
      calc(50% + ${index * 100}% + 3.3rem);
    `;
  }};
  left: 50%;
  display: flex;
  flex-direction: column;
  padding: 6rem;
  background-color: #4a72ff;
  width: 116rem;
  height: 54rem;
  border-radius: 3.2rem;
  transform: translate(-50%, -50%);
  transition: 0.8s all ease-in-out;

  .image-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 74rem;
    height: 48rem;
  }
  color: white;

  h1 {
    width: 54rem;
    font-weight: 600;
    line-height: 6.4rem;
    letter-spacing: -3.5%;
    font-size: 6rem;
    margin-bottom: auto;
  }

  span {
    width: 54rem;
    font-weight: 600;
    line-height: 2.8rem;
    letter-spacing: -3.5%;
    font-size: 2.4rem;
  }
`;

const PrincipleCard = ({ message, author, imageUrl, index }) => {
  return (
    <PrincipleCardBlock index={index}>
      <h1>{message}</h1>
      <span>by {author}</span>
      <div className='image-wrapper'>
        <Image src={imageUrl} layout='fill' />
      </div>
    </PrincipleCardBlock>
  );
};

const NextInvestorBlock = styled.div`
  color: white;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);

  button {
    color: white;
    font-size: 2rem;
    line-height: 2.8rem;
    font-weight: 600;
    border: 0.1rem solid white;
    background-color: transparent;
    padding: 0.8rem 1.6rem;
    border-radius: 10rem;
  }
`;

const PrevInvestorBlock = styled.div`
  color: white;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 8rem;
  left: 50%;
  transform: translate(-50%, 0);

  button {
    color: white;
    font-size: 2rem;
    line-height: 2.8rem;
    font-weight: 600;
    border: 0.1rem solid white;
    background-color: transparent;
    padding: 0.8rem 1.6rem;
    border-radius: 10rem;
  }

  svg {
    transform: rotate(180deg);
  }
`;

const PrevInvestor = ({ name, onClick }) => {
  return (
    <PrevInvestorBlock onClick={onClick}>
      <ChevronBottomIcon />
      <button>Prev_ {name}</button>
    </PrevInvestorBlock>
  );
};

const NextInvestor = ({ name, onClick }) => {
  return (
    <NextInvestorBlock onClick={onClick}>
      <button>Next_ {name}</button>
      <ChevronBottomIcon />
    </NextInvestorBlock>
  );
};

export default function Principles() {
  const messages = [
    {
      message:
        '“Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.”',
      author: 'Warren Buffet',
      imageUrl: '/images/warren.png',
    },
    {
      message: '“People calculate too much and think too little.”',
      author: 'Charles Munger',
      imageUrl: '/images/charles.png',
    },
    {
      message: '“Surround yourself with people trying to shape the future”',
      author: 'Cathie Wood',
      imageUrl: '/images/cathie.png',
    },
  ];
  const [cardIndex, setCardIndex] = useState(0);
  const setCardIndexIncreaseHandler = () => {
    setCardIndex((s) => {
      if (s < messages.length - 1) {
        return s + 1;
      }
      return s;
    });
  };
  const setCardIndexDecreaseHandler = () => {
    setCardIndex((s) => {
      if (s > 0) {
        return s - 1;
      }
      return s;
    });
  };
  return (
    <PrinciplesBlock>
      <div className='principle-card-wrapper'>
        {messages.map((message, index) => (
          <PrincipleCard
            index={index - cardIndex}
            key={message.message}
            {...message}
          />
        ))}
      </div>
      {cardIndex > 0 && (
        <PrevInvestor
          name={messages[cardIndex - 1].author}
          onClick={setCardIndexDecreaseHandler}
        />
      )}
      {cardIndex < messages.length - 1 && (
        <NextInvestor
          name={messages[cardIndex + 1].author}
          onClick={setCardIndexIncreaseHandler}
        />
      )}
    </PrinciplesBlock>
  );
}
