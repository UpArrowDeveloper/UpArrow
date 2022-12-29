import styled from '@emotion/styled';
import color from '../../styles/color';
import { HeadH6Bold } from '../../styles/typography';

const ViewmoreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid ${color.B80};
  height: 4rem;
  border-radius: 0.8rem;
  cursor: pointer;

  ${HeadH6Bold}
`;

const Viewmore = ({ className }) => {
  return <ViewmoreButton className={className}>view more</ViewmoreButton>;
};

export default Viewmore;
