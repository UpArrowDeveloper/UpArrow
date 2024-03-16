import React, { useEffect } from "react";
import { StyledEngineProvider } from "@mui/material";
import BackofficeLayout from "../../Layouts/Backoffice";

const BackofficeApp = () => {
  useEffect(() => {
    window.location.href = "/backoffice/stocks";
  }, []);
  return <div>main</div>;
};

const Backoffice = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BackofficeLayout>
        <BackofficeApp />
      </BackofficeLayout>
    </StyledEngineProvider>
  );
};

export default Backoffice;
