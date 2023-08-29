// material-ui
import { StyledEngineProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { getUploadUrl } from "../../../utils/file";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import { HeadH3Bold, HeadH5Bold } from "../../../styles/typography";
import TitleInput from "../../../backoffice/components/common/TitleInput";
import Divider from "../../../components/Divider";
import color from "../../../styles/color";

const BackofficeBannerAdd = () => {
  const { data: config, isLoading } = useQuery(["config"], api.config.get);
  const [youtubeCode, setYoutubeCode] = useState();
  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;
  return (
    <BackofficeMain>
      <BackofficeHeader title="Add banner" />
      <div className="backoffice-sub-title">Stock Info</div>
      <img className="thumbnail" src={getThumbnailUrl(youtubeCode)} />
      <TitleInput title="Stock Name" />
      <TitleInput title="Description" />
      <TitleInput
        title="Youtube Code"
        onChange={(e) => setYoutubeCode(e.target.value)}
      />
      <Divider className="divider" />
      <div className="add-button-wrapper">
        <button>Add</button>
      </div>
    </BackofficeMain>
  );
};

const BackofficeMain = styled.div`
  h1 {
    font-size: 4.8rem;
    font-weight: 600;
  }

  .table-wrapper {
    padding: 2.4rem 3.2rem;
  }

  .backoffice-sub-title {
    padding: 2.4rem 3.2rem;
    padding-top: 0;
    ${HeadH3Bold}
  }

  .divider {
    margin-top: 2.4rem;
  }

  .thumbnail {
    width: 48rem;
    height: 27rem;
    margin-bottom: 2.4rem;
  }

  .add-button-wrapper {
    display: flex;
    justify-content: flex-end;

    button {
      width: 24rem;
      height: 5.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: #3d67ff;
      ${HeadH5Bold}
      color: ${color.B96}
    }
  }
`;

const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <BackofficeLayout>
          <BackofficeBannerAdd />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
