import { css } from "@emotion/react";
import styled from "@emotion/styled";
import color from "../../styles/color";
import {
  Body12Medium,
  Body14Regular,
  Body16Regular,
  HeadH3Bold,
  HeadH4Bold,
  HeadH6Bold,
} from "../../styles/typography";
import Viewmore from "../common/Viewmore";
import { GrowthIcon, RiskIcon } from "../icons";

const Layer1 = ({ analysis, ideaList }) => {
  return (
    <div className="layer-1">
      <div>
        <h6>Analyses</h6>
        <Card>
          <div className="image-wrapper">
            <iframe
              style={{ borderRadius: "0.8rem", marginBottom: "1.6rem" }}
              width={320}
              height={180}
              src={`https://www.youtube.com/embed/${analysis.youtubeUrl}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
            <div className="youtube-title">{analysis.youtubeTitle}</div>
            <div className="youtube-date">{analysis.youtubeDate}</div>
          </div>
        </Card>
      </div>
      <div className="insights-of-giants">
        <h6>Insights of Giants URL</h6>
        <div className="item-list">
          {ideaList.map((link, index) => (
            <a className="item" key={index} href={link}>
              <h4 className="bold">{link}</h4>
              <div className="item-date">2023. 01. 02</div>
            </a>
          ))}
        </div>
        <Viewmore />
      </div>
    </div>
  );
};

const Layer2 = ({ analysis }) => {
  return (
    <div className="layer-2">
      <div className="top-message">
        <div className="message">
          <h6>Mission Statement</h6>
          <pre>{analysis.missionStatement}</pre>
        </div>
        <div className="message">
          <h6>Business Model</h6>
          <pre>{analysis.businessModel}</pre>
        </div>
      </div>
      <div className="bottom-message">
        <div className="message">
          <h6>Competitive Advantages</h6>
          <pre>{analysis.competitiveAdvantage}</pre>
        </div>
      </div>
    </div>
  );
};

const IconMessage = ({ isRisk = false, message }) => {
  return (
    <div className="icon-message">
      <div className="icon-wrapper">
        {isRisk ? (
          <RiskIcon className="icon" />
        ) : (
          <GrowthIcon className="icon" />
        )}
      </div>
      <p>{message}</p>
    </div>
  );
};

const Layer3 = ({ growthMessages, riskMessages }) => {
  return (
    <div className="layer-3">
      <div className="message">
        <h6>Growth Opportunities</h6>
        {growthMessages.map((message) => (
          <IconMessage message={message} />
        ))}
      </div>
      <div className="message">
        <h6>Potential Risks</h6>
        {riskMessages.map((message) => (
          <IconMessage isRisk={true} message={message} />
        ))}
      </div>
    </div>
  );
};

const Overview = ({ analysis, analysisIdeaList, ...rest }) => {
  return (
    <OverviewBlock {...rest}>
      <h3>Overview</h3>
      <div className="overview-content-wrapper">
        <Layer1 analysis={analysis} ideaList={analysisIdeaList} />
        <Layer2 analysis={analysis} />
        <Layer3
          growthMessages={analysis.growthOppertunities || []}
          riskMessages={analysis.potentialRisks || []}
        />
      </div>
    </OverviewBlock>
  );
};

const bottomBorder = css`
  padding-bottom: 2.4rem;
  margin-bottom: 2.4rem;
  border-bottom: 0.1rem solid #d9d9d9;
`;

const OverviewBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;

  .overview-content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100% !important;
    h6 {
      margin-bottom: 0.8rem;
    }
  }

  .layer-1 {
    width: 100%;
    display: flex;
    gap: 8rem;

    ${bottomBorder}

    .insights-of-giants {
      width: 100%;

      .item-list {
        margin-bottom: 1.6rem;
        .item {
          cursor: pointer;
          h4 {
            max-width: 85%;
            margin: 0;
            overflow: hidden;
          }
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 0;

          :not(:last-child) {
            border-bottom: 0.1rem solid ${color.B80};
          }

          .item-date {
            color: ${color.B40};
          }
        }
      }
    }
  }

  .message {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    flex: 1;

    pre {
      flex: 1;
      white-space: pre-wrap;
      ${Body16Regular}
    }

    .icon-message {
      display: flex;
      gap: 0.8rem;
      ${Body16Regular}
    }
  }

  .layer-2 {
    display: flex;
    flex-direction: column;
    gap: 3.2rem;

    ${bottomBorder}

    .top-message {
      display: flex;
      gap: 3.2rem;
    }

    h6 {
      margin: 0;
    }
  }

  .layer-3 {
    display: flex;
    gap: 2.3rem;

    .icon-wrapper {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  h3 {
    ${HeadH3Bold}
    margin-bottom: 1.6rem;
  }
  h4 {
    ${Body14Regular};
    color: ${color.B40};
    margin-bottom: 1.2rem;

    &.bold {
      color: #000000;
      ${HeadH4Bold};
    }
  }
  h6 {
    ${HeadH6Bold}
  }

  .youtube-title {
    ${HeadH4Bold}
  }

  .youtube-date {
    ${Body12Medium}
    color: ${color.B40};
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 32rem;

  .card-content {
    .date {
      ${Body12Medium};
      color: ${color.B40};
    }
  }
`;

export default Overview;
