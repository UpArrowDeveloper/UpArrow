import styled from "@emotion/styled";
import color from "../../styles/color";
import { Body12Medium } from "../../styles/typography";

const TagBlock = styled.div`
  display: inline-block;
  padding: 0.1rem 0.8rem;
  border: 1px solid ${color.B80};
  border-radius: 999rem;
  color: ${color.B40};
  ${Body12Medium};
`;

const Tag = ({ children }) => {
  return <TagBlock>{children}</TagBlock>;
};

export default Tag;
