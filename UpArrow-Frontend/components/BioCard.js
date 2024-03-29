import React, { useEffect, useState, Fragment } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ProfileModal from "./ProfileModal";
import Grid from "@mui/material/Grid";
import axios from "axios";
import styled from "@emotion/styled";

const BiocardBlock = styled.div`
  padding-left: 2rem;
  padding-top: 2rem;

  .investor-name-follow-button {
    display: flex;
    align-items: center;
  }

  .investor-name {
    color: rgb(32, 38, 46);
    font-size: 2.4rem;
    margin-bottom: 2rem;
    font-weight: 900;
    margin-right: 3rem;
    display: flex;
  }

  .follow-button {
    background-color: transparent;
    border: solid 0.3rem transparent;
    box-shadow: 0rem 0rem 1rem #c4c7cc;
    border-radius: 0.6rem;
    width: 12rem;
    color: rgb(32, 38, 46);
    font-size: 1.6rem;
    margin-bottom: 2rem;
    font-weight: 900;
    :hover {
      border: 0.3rem solid gray;
    }
  }

  .investor-social {
    display: flex;
    gap: 1rem;
  }
`;

const BioCard = ({
  investor,
  currentUserJSON,
  totalInvestment,
  totalProfits,
}) => {
  const [followText, setFollowText] = useState("");
  const followersObjectIdList = investor.followers || []; // a prop of followers ObjectID List from investor.js
  const currentUserStrId = currentUserJSON?._id; // currently logged in user from investor.js
  const toggleFollow = followersObjectIdList.includes(currentUserStrId); // Returns either True or False

  useEffect(() => {
    setFollowText(toggleFollow ? "Unfollow" : "Follow");
  }, [toggleFollow]);

  const totalProfitArrow =
    totalProfits >= 0 ? (
      <ArrowUpwardRoundedIcon color="success" />
    ) : (
      <ArrowDownwardRoundedIcon color="error" />
    );

  const modalList = ["Invested", "Followers", "Following"];
  const renderedModalList = modalList.map((text) => {
    const mapper = {
      Invested: "purchases",
      Followers: "followers",
      Following: "followings",
    };

    return (
      <ProfileModal
        title={text}
        docJSONList={investor[mapper[text]]}
        currentUserJSONId={currentUserJSON?._id}
        modalTitle={text}
      />
    );
  });

  return (
    <BiocardBlock>
      <div className="investor-name-follow-button">
        <div className="investor-name">{investor.investorName}</div>
        <div>
          <button
            className="follow-button"
            onClick={() => {
              console.log("not implemented");
            }}
          >
            Follow
          </button>
        </div>
      </div>

      <div class="investor-social">{renderedModalList}</div>

      <div class="investor-info">
        <div>{investor.investorDescription}</div>
        <a href={investor.investorWebsite}>{investor.investorWebsite}</a>
      </div>

      <div class="investor-financials">
        <div>
          Total Investment: $
          {new Intl.NumberFormat().format(Math.round(totalInvestment))}
        </div>
        <div>
          Total Profits: $
          {new Intl.NumberFormat().format(Math.round(totalProfits))} (
          {totalProfitArrow}{" "}
          {new Intl.NumberFormat().format(
            Math.floor((totalProfits / totalInvestment) * 100)
          )}
          %)
        </div>
        <div>
          Available Cash: $
          {new Intl.NumberFormat().format(Math.round(investor.availableCash))}
        </div>

        <div>
          Total Assets: $
          {new Intl.NumberFormat().format(
            Math.round(totalInvestment + totalProfits + investor.availableCash)
          )}
        </div>
      </div>
    </BiocardBlock>
  );
};

export default BioCard;
