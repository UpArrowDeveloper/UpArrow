import styled from "@emotion/styled";
import { Body16Regular } from "../styles/typography";

const OrderChip = ({ order, selected, onClick }) => {
  return (
    <OrderChipBlock
      className={`${selected ? "selected" : ""}`}
      onClick={onClick}
      key={order}
    >
      {order}
    </OrderChipBlock>
  );
};

const OrderChipBlock = styled.div`
  padding: 0.8rem 1.6rem;
  background: white;
  color: black;
  border-radius: 999rem;
  border: 0.1rem solid black;
  cursor: pointer;
  ${Body16Regular}

  &.selected {
    background: black;
    color: white;
  }
`;

export default OrderChip;
