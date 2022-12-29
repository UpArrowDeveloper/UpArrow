import StarRatings from 'react-star-ratings';
import styled from '@emotion/styled';

const StarRatingWrapper = styled.div`
  display: flex;
  max-width: 22rem;
  justify-content: space-between;
  align-items: center;
  line-height: 1.6rem;
`;

const StarRating = ({ title, rating }) => {
  return (
    <StarRatingWrapper>
      <div className='star-rating-title'>{title}</div>
      <StarRatings
        rating={rating}
        starRatedColor='orange'
        // changeRating={this.changeRating}
        starDimension='20px'
        starSpacing='2px'
        numberOfStars={5}
        name='rating'
      />
    </StarRatingWrapper>
  );
};

export default StarRating;
