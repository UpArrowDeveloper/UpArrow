// material-ui
import { StyledEngineProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import api from "../../../../apis";
import BackofficeLayout from "../../../../Layouts/Backoffice";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../../backoffice/components/common/Header";
import { HeadH3Bold, HeadH5Bold } from "../../../../styles/typography";
import TitleInput from "../../../../backoffice/components/common/TitleInput";
import Divider from "../../../../components/Divider";
import color from "../../../../styles/color";
import { useRouter } from "next/router";
import { FileUploader } from "../../../../backoffice/components/common/FileUploader";
import axios from "axios";
import { env } from "../../../../config";

const BackofficeBannerEdit = () => {
  const { id } = useRouter().query;
  const router = useRouter();
  const { data } = useQuery(["banner", id], api.banner.getById(id), {
    enabled: !!id,
  });

  const [stockName, setStockName] = useState();
  const [description, setDescription] = useState();
  const [youtubeCode, setYoutubeCode] = useState();
  const [logoImage, setLogoImage] = useState();

  useEffect(() => {
    if (data) {
      setStockName(data.stockName);
      setDescription(data.description);
      setYoutubeCode(data.youtubeCode);
    }
  }, [data, id]);
  const getThumbnailUrl = (code) => `http://img.youtube.com/vi/${code}/0.jpg`;
  const submit = async () => {
    if (!logoImage) {
      alert("Please upload thumbnail image");
      return;
    }
    const imageForm = new FormData();
    imageForm.append("image", logoImage);
    const { link } = (
      await axios.post(`${env.serverUrl}/file/upload`, imageForm)
    ).data;
    await api.banner.put(id, {
      stockName,
      description,
      youtubeCode,
      thumbnailUrl: link,
    });
    router.push("/backoffice/main");
  };
  console.log("data : ", data);
  if (!data) return null;

  return (
    <BackofficeMain>
      <BackofficeHeader title="Edit banner" />
      <div className="backoffice-sub-title">Stock Info</div>
      <img className="thumbnail" src={getThumbnailUrl(youtubeCode)} />
      <TitleInput
        title="Stock Name"
        value={stockName}
        onChange={(v) => setStockName(v.target.value)}
      />
      <TitleInput
        title="Description"
        value={description}
        onChange={(v) => {
          setDescription(v.target.value);
        }}
      />
      <TitleInput
        title="Youtube Code"
        value={youtubeCode}
        onChange={(e) => setYoutubeCode(e.target.value)}
      />
      <FileUploader
        name="thumbnail-image"
        file={logoImage}
        url={data?.thumbnailUrl}
        setImage={setLogoImage}
        previewStyle={{
          width: "40rem",
          height: "20rem",
        }}
      />
      <Divider className="divider" />
      <div className="add-button-wrapper">
        <button onClick={() => submit()}>Edit</button>
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
          <BackofficeBannerEdit />
        </BackofficeLayout>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};

export default App;
