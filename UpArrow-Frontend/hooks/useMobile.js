import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../styles/responsive";

const debounce = (callback, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const htmlRef = useRef();

  const f = debounce(() => {
    const mobileWidthNum = Number(mobileWidth.replace("px", ""));
    setIsMobile(mobileWidthNum > htmlRef.current?.clientWidth);
  }, 100);

  useEffect(() => {
    htmlRef.current = document.querySelector("html");
    window.addEventListener("resize", f);
  }, []);

  return { isMobile };
};
