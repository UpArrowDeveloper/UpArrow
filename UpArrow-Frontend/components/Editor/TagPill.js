import styled from "@emotion/styled";
import color from "../../styles/color";
import { Body16Regular } from "../../styles/typography";
import { XIcon } from "../icons";
import { mobileWidth } from "../../styles/responsive";

const TagPillBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${Body16Regular}
  gap:0.8rem;
  padding: 0.8rem;
  border: 0.1rem solid ${color.B80};
  border-radius: 12rem;

  & > img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 999rem;
    border: 0.1rem solid rgba(0 0 0 / 20%);
  }

  .x-icon {
    cursor: pointer;
  }

  @media screen and (max-width: ${mobileWidth}) {
    height: auto;
  }
`;

const TagPill = ({ label, clean, stockImageUrl, onClick = () => {} }) => {
  return (
    <TagPillBlock onClick={onClick}>
      <img src={stockImageUrl} />
      <span>{label}</span>
      {clean && <XIcon className="x-icon" onClick={() => clean()} />}
    </TagPillBlock>
  );
};

export default TagPill;
