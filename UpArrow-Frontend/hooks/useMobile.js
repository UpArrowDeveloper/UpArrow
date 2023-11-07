import { useLayoutEffect, useRef, useState } from "react";
import { mobileWidth } from "../styles/responsive";

const debounce = (callback, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

export const useMobile = () => {
  let mobileWidthNum = Number(mobileWidth.replace("px", ""));
  const htmlRef = useRef();
  const [isMobile, setIsMobile] = useState(
    mobileWidthNum > htmlRef.current?.clientWidth ||
      (typeof window !== "undefined" && window.innerWidth < mobileWidthNum)
  );

  const f = debounce(() => {
    mobileWidthNum = Number(mobileWidth.replace("px", ""));
    setIsMobile(mobileWidthNum > htmlRef.current?.clientWidth);
  }, 100);

  useLayoutEffect(() => {
    htmlRef.current = document.querySelector("html");
    window.addEventListener("resize", f);
    f();
  }, []);

  return { isMobile };
};
