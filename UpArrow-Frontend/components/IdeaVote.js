import styled from "@emotion/styled";
import { ThumbUpIcon, ThumbDownIcon } from "./icons";
import color from "../styles/color";
import { Body12Medium } from "../styles/typography";
import { mobileWidth } from "../styles/responsive";

const IdeaVote = ({ agreeCount, disagreeCount }) => {
  const totalCount = agreeCount + disagreeCount;
  const agreePercent =
    disagreeCount === 0 ? "100%" : (agreeCount / totalCount) * 100 + "%";
  const disagreePercent =
    agreeCount === 0 ? "100%" : (disagreeCount / totalCount) * 100 + "%";
  return (
    <IdeaVoteBlock
      agreePercent={agreePercent}
      disagreePercent={disagreePercent}
    >
      <div className="indicator-wrapper">
        <div className="indicator">
          <ThumbUpIcon className="indicator-icon" width={16} height={16} />
          Agree
        </div>
        <div className="indicator">
          <ThumbDownIcon className="indicator-icon" width={16} height={16} />
          Disagree
        </div>
      </div>
      <div className="vote-bar">
        <div className="agree-bar"></div>
        <div className="disagree-bar"></div>
      </div>
    </IdeaVoteBlock>
  );
};

const IdeaVoteBlock = styled.div`
  display: flex;
  flex-direction: column;

  .indicator {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    ${Body12Medium};
    color: ${color.B53};
    .indicator-icon {
      fill: ${color.B53};
    }
  }

  .indicator-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .vote-bar {
    display: flex;
    border-radius: 999rem;
    overflow: hidden;
    height: 0.8rem;

    .agree-bar {
      width: ${({ agreePercent }) => agreePercent};
      height: 100%;
      background-color: ${color.AGREE_GREEN};
    }
    .disagree-bar {
      width: ${({ disagreePercent }) => disagreePercent};
      height: 100%;
      background-color: ${color.DISAGREE_RED};
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .vote-bar {
      height: 0.4rem;
    }
  }
`;

export default IdeaVote;
