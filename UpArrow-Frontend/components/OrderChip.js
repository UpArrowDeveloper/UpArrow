import styled from '@emotion/styled';

const OrderChipBlock = styled.div`
  padding: 0.8rem 1.6rem;
  background: white;
  color: black;
  border-radius: 999rem;
  border: 0.1rem solid black;
  cursor: pointer;

  &.selected {
    background: black;
    color: white;
  }
`;

const OrderChip = ({ order, selected, onClick }) => {
  return (
    <OrderChipBlock
      className={`${selected ? 'selected' : ''}`}
      onClick={onClick}
      key={order}
    >
      {order}
    </OrderChipBlock>
  );
};

export default OrderChip;
