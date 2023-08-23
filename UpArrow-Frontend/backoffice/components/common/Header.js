import styled from "@emotion/styled";
import { WhitePlusIcon } from "../../../components/icons";

const BackofficeHeader = ({ title, onClick }) => {
  return (
    <HeaderBlock>
      <h1>{title}</h1>
      <div className="add" onClick={onClick}>
        <WhitePlusIcon />
      </div>
    </HeaderBlock>
  );
};

export default BackofficeHeader;

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;

  .add {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #222;
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 999rem;
  }

  h1 {
    font-size: 4.8rem;
    font-weight: 600;
  }
`;
