import styled from '@emotion/styled';

const ManagementWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .circle-title-wrapper {
    display: flex;
    align-items: center;

    & > span {
      font-size: 2rem;
      width: 10rem;
    }

    .circle-ratio-ui {
      margin-right: 2rem;
    }
  }

  .ceo-info {
    display: flex;
    img {
      width: 10rem;
      height: 10rem;
      border-radius: 999rem;
      margin-right: 0.8rem;
    }

    .name {
      font-size: 2rem;
    }
  }
`;

const CircleRatioWrapper = styled.div`
  position: relative;
  width: 10rem;
  height: 10rem;
  background-color: green;
  border-radius: 999rem;

  .ratio {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 8rem;
    height: 8rem;
    background-color: white;
    border-radius: 999rem;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.4rem;

    z-index: 10;
  }

  .green {
    position: absolute;
    top: 0;
    left: 0;
    width: 10rem;
    height: 10rem;
    border-radius: 999rem;
    background-image: linear-gradient(90deg, transparent 50%, green 50%),
      /* 10% = 126deg = 90 + ( 360 * .1 ) */
        linear-gradient(20deg, transparent 50%, #dddddd 50%);
  }
`;

const CircleRatio = ({ ratio, ...restProps }) => {
  return (
    <CircleRatioWrapper {...restProps}>
      <div className='ratio'>{ratio}%</div>
      <div className='green'></div>
    </CircleRatioWrapper>
  );
};

const Management = ({ management }) => {
  const { recommendRatio, approveOfCEO, ceoInfo } = management;
  return (
    <ManagementWrapper>
      <div className='circle-title-wrapper'>
        <CircleRatio className='circle-ratio-ui' ratio={recommendRatio} />
        <span>Recommend to a Friend</span>
      </div>
      <div className='circle-title-wrapper'>
        <CircleRatio className='circle-ratio-ui' ratio={approveOfCEO} />
        <span>Approve of CEO</span>
      </div>
      <div className='ceo-info'>
        <img src={ceoInfo.profileImageUrl} />
        <div>
          <div className='name'>{ceoInfo.name}</div>
        </div>
      </div>
    </ManagementWrapper>
  );
};

export default Management;
