import styled from "@emotion/styled";
import { PersonIcon, WhitePlusIcon } from "../../../components/icons";

const BackofficeHeader = ({ title, onClick, onSubClick }) => {
  return (
    <HeaderBlock>
      <h1>{title}</h1>
      <div className="header-buttons">
        {onClick && (
          <div className="add" onClick={onClick}>
            <WhitePlusIcon />
          </div>
        )}
        {onSubClick && (
          <div className="add" onClick={onSubClick}>
            <PersonIcon />
          </div>
        )}
      </div>
    </HeaderBlock>
  );
};

export default BackofficeHeader;

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2.4rem 3.2rem;
  margin-bottom: 1.6rem;

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

  .header-buttons {
    display: flex;
    gap: 1.6rem;
  }
`;
