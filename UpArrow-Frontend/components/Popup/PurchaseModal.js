import styled from "@emotion/styled";
import React from "react";
import { HeadH3Bold, HeadH4Bold, HeadH5Bold } from "../../styles/typography";
import Button from "../common/Button";
import { mobileWidth } from "../../styles/responsive";

export const PurchaseModal = ({
  onConfirm,
  title = "Congraturations!",
  message,
}) => {
  return (
    <SignupCelebrateBlock>
      <h1>{title}</h1>
      <pre>{message}</pre>
      <Button onClick={onConfirm}>Got it!</Button>
    </SignupCelebrateBlock>
  );
};

const SignupCelebrateBlock = styled.div`
  width: 36rem;
  padding: 2.4rem;
  background-color: white;
  border: 0.1rem solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1.6rem 12rem rgba(0, 0, 0, 0.1);
  border-radius: 1.6rem;

  .celebrate {
    font-size: 6rem;
  }

  p {
    text-align: center;
    margin-bottom: 3.2rem;
  }

  h1 {
    text-align: center;
    ${HeadH4Bold}
    margin-bottom: 1.6rem;
  }

  pre {
    text-align: center;
    margin-bottom: 2.4rem;
    font-size: 1.6rem;
    line-height: 2.2rem;
  }

  button {
    width: 100%;
    padding: 1.6rem;
    ${HeadH5Bold}
  }

  @media screen and (max-width: ${mobileWidth}) {
    width: 30rem;
    pre {
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  }
`;
