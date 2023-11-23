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
  let mobileWidthNum = Number(mobileWidth.replace("px", ""));
  const htmlRef = useRef();
  const smallWidth = Math.min(
    htmlRef.current?.clientWidth || 9999,
    typeof window !== "undefined" ? window.innerWidth : 9999
  );

  const condition = smallWidth < mobileWidthNum;

  const [isMobile, setIsMobile] = useState(condition);

  const f = debounce(() => {
    const smallWidth = Math.min(
      htmlRef.current?.clientWidth || 9999,
      typeof window !== "undefined" ? window.innerWidth : 9999
    );
    const condition = smallWidth < mobileWidthNum;
    mobileWidthNum = Number(mobileWidth.replace("px", ""));

    setIsMobile(condition);
  }, 100);

  useEffect(() => {
    htmlRef.current = document.querySelector("html");
    window.addEventListener("resize", f);
    f();
  }, []);

  return { isMobile };
};
