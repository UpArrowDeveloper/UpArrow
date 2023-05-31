import { useEffect, useState } from "react";
import { mobileWidth } from "../styles/responsive";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const f = () => {
    const mobileWidthNum = Number(mobileWidth.replace("px", ""));
    setIsMobile(mobileWidthNum > window.innerWidth);
    setTimeout(() => {
      f();
    }, 1000);
  };
  useEffect(() => {
    f();
  }, []);

  return { isMobile };
};
