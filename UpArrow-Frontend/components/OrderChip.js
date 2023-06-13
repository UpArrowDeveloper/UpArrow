import styled from "@emotion/styled";
import { Body12Medium, Body16Regular } from "../styles/typography";
import { mobileWidth } from "../styles/responsive";

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
  border: 0.1rem solid rgba(0 0 0 / 20%);
  cursor: pointer;
  ${Body16Regular}

  &.selected {
    background: black;
    color: white;
  }
  @media screen and (max-width: ${mobileWidth}) {
    padding: 0.8rem 1.4rem;
    ${Body12Medium}
  }
`;

export default OrderChip;
