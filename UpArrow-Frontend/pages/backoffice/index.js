import React from "react";
import BackofficeLayout from "../../Layouts/Backoffice";

const BackofficeApp = () => {
  useEffec(() => {
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
