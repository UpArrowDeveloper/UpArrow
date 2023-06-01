import { useEffect, useRef, useState } from "react";
import { mobileWidth } from "../styles/responsive";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const htmlRef = useRef();

  const f = () => {
    const mobileWidthNum = Number(mobileWidth.replace("px", ""));
    setIsMobile(mobileWidthNum > htmlRef.current?.clientWidth);
    setTimeout(() => {
      f();
    }, 1000);
  };
  useEffect(() => {
    htmlRef.current = document.querySelector("html");
    f();
  }, []);

  return { isMobile };
};
