import styled from "@emotion/styled";
import { numberComma } from "../../utils/number";
import Rank from "./Rank";
import Avatar from "./Avatar";
import {
  Body10Medium,
  Body14Regular,
  FollowBtn,
  HeadH4Bold,
  HeadH6Bold,
} from "../../styles/typography";
import color from "../../styles/color";
import { mobileWidth } from "../../styles/responsive";
import api from "../../apis";
import { useAppUser } from "../../hooks/useAppUser";
import { useEffect, useState } from "react";

const InvestorProfileView = ({
  id,
  profileImageUrl,
  username,
  investedCompanies,
  followers,
  followings,
  description,
  websiteUrl,
  cash,
  totalInvestment,
  totalAssets,
  totalProfits,
  rank,
  userRefetch,
}) => {
  const { user, refetch } = useAppUser();
  const [isFollowLoading, setIsFolloweLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    !!user?.followings?.includes(id)
  );

  useEffect(() => {
    setIsFollowed(!!user?.followings?.includes(id));
  }, [id, user]);

  return (
    <InvestorProfileBlock>
      <Rank rank={rank} />
      <Avatar className="avatar" src={profileImageUrl} />
      <div className="name">{username}</div>
      <button
        disabled={id === user?._id || isFollowLoading || !user}
        className={`follow-btn ${isFollowed ? "following" : ""} ${
          id === user?._id || isFollowLoading || !user ? "disabled" : ""
        } `}
        onClick={async () => {
          if (id === user?._id || isFollowLoading) return;
          setIsFollowed((s) => !s);
          setIsFolloweLoading(true);
          await api.user.followUserById(id);
          setIsFolloweLoading(false);
          userRefetch();
          refetch();
        }}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </button>
      <div className="invest-info">
        <div>
          <span>{investedCompanies.length}</span> Invested
        </div>
        <div>
          <span>{followers.length}</span> Followers
        </div>
        <div>
          <span>{followings.length}</span> Following
        </div>
      </div>
      <hr />
      <div className="description">{description}</div>
      <div className="website-url">
        <a href={websiteUrl}>{websiteUrl}</a>
      </div>
      <h4 className="financials">Financials</h4>
      <div className="cash-block">
        <div>
          <div className="label">Available Cash</div>
          <div className="cash">${numberComma(cash)}</div>
        </div>
        <div>
          <div className="label">Total Investment</div>
          <div className="cash">${numberComma(totalInvestment)}</div>
        </div>
        <div className={totalProfits >= 0 ? "earned" : "lost"}>
          <div className="label">Total Profits</div>
          <div className="cash">${numberComma(totalProfits)}</div>
        </div>
        <div className={totalAssets >= 0 ? "earned" : "lost"}>
          <div className="label">Total Assets</div>
          <div className="cash">${numberComma(totalAssets)}</div>
        </div>
      </div>
    </InvestorProfileBlock>
  );
};

const InvestorProfileBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  margin: 2rem;
  margin-top: 3.8rem;
  padding: 2rem;
  border-radius: 0.6rem;

  .avatar {
    width: 10rem;
    height: 10rem;
    margin-bottom: 1.6rem;
  }

  .name {
    ${HeadH4Bold}
    margin-bottom: 1.6rem;
  }

  .follow-btn {
    width: 7rem;
    height: 3rem;
    background-color: ${color.UpArrow_Blue};
    color: white;
    border: none;
    border-radius: 999rem;
    ${FollowBtn}
    margin-bottom: 1.6rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &.following {
      background-color: ${color.DISAGREE_RED};
    }
    &.disabled {
      opacity: 0.7;
    }
  }

  .invest-info {
    display: flex;
    gap: 2.4rem;
    ${Body14Regular}
    span {
      font-weight: 600;
    }
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: 0.1rem solid #d9d9d9;
    & > div {
      text-align: center;
    }
  }

  .description,
  .website-url {
    ${Body14Regular}
    color: ${color.B27};
    overflow-wrap: break-word;
  }

  .website-url {
    width: 100%;
    margin-bottom: 4.8rem;
  }

  .financials {
    width: 100%;
    ${HeadH6Bold}
    margin-bottom: 1.4rem;
  }

  .cash-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid ${color.B93};
    border-radius: 0.8rem;

    & > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.8rem;
      align-items: center;
      border: 1px solid ${color.B93};
      color: ${color.B13};
      height: 12rem;
    }

    .earned {
      color: ${color.AGREE_GREEN};
    }

    .lost {
      color: ${color.DISAGREE_RED};
    }

    .label {
      ${Body14Regular};
    }

    .cash {
      font-size: 2.4rem;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .invest-info {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .website-url {
      margin-bottom: 2.4rem;
    }

    .cash-block {
      width: 100%;
      .label {
        ${Body10Medium}
      }
      .cash {
        ${HeadH6Bold}
      }
    }
  }
`;

export default InvestorProfileView;
