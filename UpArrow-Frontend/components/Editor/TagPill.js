import styled from '@emotion/styled';
import color from '../../styles/color';
import { Body16Regular } from '../../styles/typography';
import { XIcon } from '../icons';

const TagPillBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${Body16Regular}
  gap:0.8rem;
  padding: 0.8rem;
  border: 0.1rem solid ${color.B80};
  height: 4.8rem;
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
`;

const TagPill = ({ label, clean, stockImageUrl }) => {
  return (
    <TagPillBlock>
      <img src={stockImageUrl} />
      <span>{label}</span>
      {clean && <XIcon className='x-icon' onClick={() => clean()} />}
    </TagPillBlock>
  );
};

export default TagPill;
