import { css } from "@emotion/react";
import styled from "@emotion/styled";
import color from "../../styles/color";
import {
  Body12Medium,
  Body14Bold,
  Body14Medium,
  Body14Regular,
  Body16Regular,
  HeadH3Bold,
  HeadH4Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../styles/typography";
import Viewmore from "../common/Viewmore";
import { GrowthIcon, RiskIcon } from "../icons";
import { mobileWidth } from "../../styles/responsive";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const Layer1 = ({ stock, analysis, ideaList }) => {
  return (
    <div className="layer-1">
      <div style={{ flex: 1 }}>
        <h6>Analyses</h6>
        <Card>
          <div className="youtube-image-wrapper">
            <iframe
              style={{
                borderRadius: "0.8rem",
                marginBottom: "1.6rem",
                width: "100%",
                height: "100%",
              }}
              src={`https://www.youtube.com/embed/${analysis.youtubeUrl}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <div className="youtube-title">{analysis.youtubeTitle}</div>
            <div className="youtube-date">{analysis.youtubeDate}</div>
          </div>
        </Card>
      </div>
      <div className="insights-of-giants">
        <h6>Updates on {stock?.name}</h6>
        <div className="item-list">
          {ideaList.reverse().map((item, index) => {
            return (
              <a className="item" key={index} href={item.link} target="_blank">
                <div style={{ width: "100%" }}>
                  <h4 className="bold">{item.summary}</h4>
                  <div style={{ fontSize: 14 }}>
                    {timeAgo.format(new Date(item.updatedAt))}
                  </div>
                </div>
                {item.thumbnailLink && (
                  <img className="youtube-image" src={item.thumbnailLink} />
                )}
              </a>
            );
          })}
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
    <IconMessageBlock detail={message.detail}>
      <div className="icon-wrapper">
        {isRisk ? (
          <RiskIcon className="icon" />
        ) : (
          <GrowthIcon className="icon" />
        )}
      </div>
      <p>{message.summary}</p>
    </IconMessageBlock>
  );
};

const Layer3 = ({ strengths, weaknesses, growthMessages, riskMessages }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "3.2rem",
      }}
    >
      <div className="layer-3">
        <div className="message">
          <h6>Strengths</h6>
          {strengths.map((message) => (
            <IconMessage message={message} />
          ))}
        </div>
        <div className="message">
          <h6>Potential Risks</h6>
          {weaknesses.map((message) => (
            <IconMessage isRisk={true} message={message} />
          ))}
        </div>
      </div>
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
    </div>
  );
};

const Overview = ({ stock, analysis, analysisIdeaList, ...rest }) => {
  return (
    <OverviewBlock {...rest}>
      <h3>Overview</h3>
      <div className="overview-content-wrapper">
        <Layer1 stock={stock} analysis={analysis} ideaList={analysisIdeaList} />
        <Layer2 analysis={analysis} />
        <Layer3
          strengths={analysis.strengths || []}
          weaknesses={analysis.weaknesses || []}
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

const IconMessageBlock = styled.div`
  position: relative;
  display: flex;
  gap: 0.8rem;
  ${Body16Regular}
  cursor: pointer;

  &:hover {
    &::after {
      position: absolute;
      top: -6.8rem;
      border: 0.1rem solid #d9d9d9;
      background-color: white;
      padding: 0.8rem 1.6rem;
      border-radius: 0.8rem;
      content: "${(props) => props.detail}";
      z-index: 10;
    }
  }
`;

const OverviewBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;
  margin-left: 3.2rem;

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
    justify-content: space-between;
    gap: 8rem;

    ${bottomBorder}

    .youtube-image-wrapper {
      width: 100%;
      height: 100%;
      min-height: 40rem;
      position: relative;
      overflow: hidden;
      border-radius: 0.8rem;
      box-shadow: 0 0 0.8rem 0.1rem rgba(0 0 0 / 10%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.6rem;
      iframe {
        flex: 1;
      }
    }

    .insights-of-giants {
      width: 50%;
      min-width: 20%;

      .item-list {
        margin-bottom: 1.6rem;
        .youtube-image {
          width: 100px;
          border-radius: 0.8rem;
        }
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

  @media screen and (max-width: ${mobileWidth}) {
    padding: 0;
    border: none;

    h3 {
      ${HeadH5Bold}
    }

    h4.bold {
      ${Body14Medium}
    }

    h6 {
      ${Body14Bold}
    }

    .layer-1 {
      flex-direction: column;

      .youtube-title {
        ${Body14Medium}
        margin-bottom: 0.8rem;
      }

      gap: 1.6rem;

      a.item {
        gap: 2.4rem;
      }
      .item-date {
        white-space: nowrap;
      }
    }

    .layer-2 {
      gap: 1.6rem;

      .top-message {
        flex-direction: column;
      }

      pre {
        ${Body14Regular}
      }
    }

    .layer-3 {
      flex-direction: column;
      padding-bottom: 2rem;
      border-bottom: 0.05rem solid rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;

      p {
        ${Body14Regular}
      }
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  flex: 1;

  .card-content {
    .date {
      ${Body12Medium};
      color: ${color.B40};
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    width: 100%;
  }
`;

export default Overview;
