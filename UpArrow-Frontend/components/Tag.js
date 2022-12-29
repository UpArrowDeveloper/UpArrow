import styled from '@emotion/styled';
import color from '../styles/color';
import { Body12Medium } from '../styles/typography';

const TagBlock = styled.div`
  padding: 0.3rem 0.8rem;
  ${Body12Medium};
  color: ${({ color }) => color};
  border: 0.1rem solid ${({ color }) => color};
  border-radius: 999rem;
  background-color: ${({ type }) => {
    if (type === 'plus') return 'rgba(52 170 82 / 6%)';
    if (type === 'minus') return 'rgba(255 51 63 / 4%)';
    return '';
  }};
`;

const TagGroupBlock = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const getColor = (type) => {
  switch (type) {
    case 'outline':
      return color.B40;
    case 'plus':
      return color.AGREE_GREEN;
    case 'minus':
      return color.DISAGREE_RED;
  }
};

export const Tag = ({ children, type = 'outline' }) => {
  return (
    <TagBlock color={getColor(type)} type={type}>
      {children}
    </TagBlock>
  );
};

export const TagGroup = ({ tags }) => {
  return (
    <TagGroupBlock>
      {tags.map((tag) => (
        <Tag key={tag.name} type={tag.type}>
          {tag.name}
        </Tag>
      ))}
    </TagGroupBlock>
  );
};

export default Tag;
