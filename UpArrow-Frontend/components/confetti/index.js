import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useModal from "../../hooks/useModal";

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
  const { openModal, closeModal } = useModal();
  const [run, setRun] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    if (!isCelebrating) return;
    openModal({
      children: ({ onConfirm }) => (
        <div>
          <h1>Confetti</h1>
          <button onClick={onConfirm}>Close</button>
        </div>
      ),
      onConfirm: () => {
        closeModal();
        setRun(false);
      },
    });
  }, []);

  return (
    <div>{run && <Confetti width={width} height={height} recycle={run} />}</div>
  );
};
