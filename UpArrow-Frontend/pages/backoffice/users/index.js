import { useQuery } from "@tanstack/react-query";
import React from "react";
import { RecoilRoot } from "recoil";
import api from "../../../apis";
import BackofficeLayout from "../../../Layouts/Backoffice";
import { getYMD } from "../../../utils/date";
import styled from "@emotion/styled";
import BackofficeHeader from "../../../backoffice/components/common/Header";
import Table from "../../../backoffice/components/common/Table";
import { useRouter } from "next/router";
import useModal from "../../../hooks/useModal";
import { Popup } from "../../../components/Popup";
import { HeadH3Bold, HeadH5Bold } from "../../../styles/typography";
import TitleInput from "../../../backoffice/components/common/TitleInput";

const BackofficeBannerList = () => {
  const { data: users } = useQuery(["users"], api.user.get);
  const router = useRouter();
  const { openModal } = useModal();
  return (
    <BackofficeMain>
      <BackofficeHeader
        title="User"
        onClick={() => {
          openModal({
            children: LoginPopup,
            onConfirm: () => {},
          });
        }}
        onSubClick={() => {
          openModal({
            children: SignupPopup,
            onConfirm: () => {},
          });
        }}
      />
      <div className="table-wrapper">
        <Table
          columns={["Image", "Name", "User Name", "Email", "Sign up at"]}
          datas={
            users?.map((user) => {
              return {
                id: user._id,
                items: [
                  user.profileImageUrl,
                  user?.name,
                  user?.username,
                  user?.email,
                  getYMD(new Date(user?.createdAt), ". "),
                ],
              };
            }) || []
          }
          gridTemplateColumns={["7.2rem", "2fr", "0.8fr", "0.8fr", "0.8fr"]}
          onDelete={async (id) => {
            await api.user.deleteById(id);
            router.reload();
          }}
        />
      </div>
      <Popup />
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
`;

const LoginPopupBlock = styled.div`
  background-color: #fff;
  border-radius: 1.6rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2.4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    ${HeadH3Bold}
    margin-bottom: 1.6rem;
  }

  .submit-button {
    height: 5.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #3d67ff;
    color: #fff;
    margin-top: 2.4rem;
    width: 31.2rem;
    ${HeadH5Bold}
  }
`;

const LoginPopup = () => {
  return (
    <LoginPopupBlock>
      <h3>Custom Login</h3>
      <TitleInput style={{ width: "100%" }} title="Email" />
      <TitleInput style={{ width: "100%" }} title="Password" />
      <div className="submit-button">Login</div>
    </LoginPopupBlock>
  );
};

const SignupPopup = () => {
  return (
    <LoginPopupBlock>
      <h3>Custom Signup</h3>
      <TitleInput style={{ width: "100%" }} title="Email" />
      <TitleInput style={{ width: "100%" }} title="Name" />
      <div className="submit-button">Custom Sign-up</div>
    </LoginPopupBlock>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <BackofficeLayout>
        <BackofficeBannerList />
      </BackofficeLayout>
    </RecoilRoot>
  );
};

export default App;
