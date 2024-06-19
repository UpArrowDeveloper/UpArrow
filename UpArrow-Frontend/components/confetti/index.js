import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Confetti from "react-confetti";
import useModal from "../../hooks/useModal";
import { HeadH6Bold } from "../../styles/typography";
import { useAppUser } from "../../hooks/useAppUser";
import api from "../../apis";

function getWindowDimensions() {
  if (typeof window === "undefined") return { width: 2000, height: 2000 };
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export default () => {
  const { width, height } = useWindowDimensions();
  const { user } = useAppUser();
  const { openModal, closeModal } = useModal();
  const [run, setRun] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(true);

  useEffect(() => {
    setIsCelebrating(user?.overTen);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (!isCelebrating) return setRun(false);
    setRun(true);
    openModal({
      children: ({ onConfirm }) => (
        <CongratsModal onClick={onConfirm}>
          <h1>
            “Congratulations! You earned $1000 (simulation money) because more
            than 10 other users liked your investment ideas.”
          </h1>
          <button onClick={() => onConfirm()}>Ok</button>
        </CongratsModal>
      ),
      onConfirm: () => {
        closeModal();
        api.user.resetOverTen(user._id).then(() => {
          setIsCelebrating(false);
          setRun(false);
        });
      },
      onOutsideClick: () => {
        closeModal();
        setRun(false);
      },
    });
  }, [isCelebrating, user]);

  return (
    <div>{run && <Confetti width={width} height={height} recycle={run} />}</div>
  );
};

const CongratsModal = styled.div`
  background-color: white;

  max-width: 350px;
  max-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  padding: 40px;

  h1 {
    text-align: center;
    ${HeadH6Bold}
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #f2f2f2;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;
