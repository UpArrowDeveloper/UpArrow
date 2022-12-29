import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import color from '../../styles/color';
import {
  Body12Medium,
  Body14Regular,
  Body16Regular,
  HeadH3Bold,
  HeadH4Bold,
  HeadH6Bold,
} from '../../styles/typography';
import Viewmore from '../common/Viewmore';
import { GrowthIcon, RiskIcon } from '../icons';

const bottomBorder = css`
  padding-bottom: 2.4rem;
  margin-bottom: 2.4rem;
  border-bottom: 0.1rem solid #d9d9d9;
`;

const OverviewBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;

  .overview-content-wrapper {
    display: flex;
    flex-direction: column;

    h6 {
      margin-bottom: 0.8rem;
    }
  }

  .layer-1 {
    width: 100%;
    display: flex;
    gap: 8rem;

    ${bottomBorder}

    .insights-of-giants {
      width: 100%;

      .item-list {
        margin-bottom: 1.6rem;
        .item {
          h4 {
            margin: 0;
          }
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 0;

          :not(:last-child) {
            border-bottom: 0.1rem solid ${color.B80};
          }

          .item-date {
            color: ${color.B40};
          }
        }
      }
    }
  }

  .message {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;

    p {
      ${Body16Regular}
    }

    .icon-message {
      display: flex;
      gap: 0.8rem;
    }
  }

  .layer-2 {
    display: flex;
    flex-direction: column;
    gap: 3.2rem;

    ${bottomBorder}

    .top-message {
      display: flex;
      gap: 3.2rem;
    }

    h6 {
      margin: 0;
    }
  }

  .layer-3 {
    display: flex;
    gap: 2.3rem;

    .icon-wrapper {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  h3 {
    ${HeadH3Bold}
    margin-bottom: 1.6rem;
  }
  h4 {
    ${Body14Regular};
    color: ${color.B40};
    margin-bottom: 1.2rem;

    &.bold {
      color: #000000;
      ${HeadH4Bold};
    }
  }
  h6 {
    ${HeadH6Bold}
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 32rem;
  .image-wrapper {
    position: relative;
    width: 32rem;
    height: 18rem;
  }

  .card-content {
    .date {
      ${Body12Medium};
      color: ${color.B40};
    }
  }
`;

const Layer1 = () => {
  return (
    <div className='layer-1'>
      <div>
        <h6>Analyses</h6>
        <Card>
          <div className='image-wrapper'>
            <Image src='/images/elon.png' layout='fill' />
          </div>
          <div className='card-content'>
            <h4 className='bold'>
              Reasons Why Tesla will Become the Most Valuable Company
            </h4>
            <div className='date'>2022.11.30</div>
          </div>
        </Card>
      </div>
      <div className='insights-of-giants'>
        <h6>Insights of Giants</h6>
        <div className='item-list'>
          {[
            {
              text: 'Reasons Why Tesla will Become the Most Valuable',
              date: '2022.11.30',
            },
            {
              text: 'Reasons Why Tesla will Become the Most Valuable',
              date: '2022.11.30',
            },
            {
              text: 'Reasons Why Tesla will Become the Most Valuable',
              date: '2022.11.30',
            },
            {
              text: 'Reasons Why Tesla will Become the Most Valuable',
              date: '2022.11.30',
            },
            {
              text: 'Reasons Why Tesla will Become the Most Valuable',
              date: '2022.11.30',
            },
          ].map((item, index) => (
            <div className='item' key={index}>
              <h4 className='bold'>{item.text}</h4>
              <div className='item-date'>{item.date}</div>
            </div>
          ))}
        </div>
        <Viewmore />
      </div>
    </div>
  );
};

const Layer2 = () => {
  return (
    <div className='layer-2'>
      <div className='top-message'>
        <div className='message'>
          <h6>Mission Statement</h6>
          <p>
            Bringing the best user experience to its customers through
            innovative hardware, software and services. Apple's vision statement
            is clear, concise, and to the point
          </p>
        </div>
        <div className='message'>
          <h6>Business Model</h6>
          <p>
            Selling as many iPhones, iPads, Macs, Watches, AirPods, and Apps
            around the world.
          </p>
        </div>
      </div>
      <div className='bottom-message'>
        <div className='message'>
          <h6>Competitive Advantages</h6>
          <p>
            Once you use an iPhone, it’s difficult to switch to other brand as
            you get use to its user experience. Furthermore, Apple has a great
            ecosystem. iPhones, iPads, Macs, Watches, AirPods works together
            seamlessly. Which cause iPhone users to buy other Apple products.
            Premium brand image thanks to beautiful product design. Apple users
            are loyal and they re likely to buy Apple products even if the
            prices are increased. Apple charges 30% cut from app developers.
          </p>
        </div>
      </div>
    </div>
  );
};

const IconMessage = ({ isRisk = false, message }) => {
  return (
    <div className='icon-message'>
      <div className='icon-wrapper'>
        {isRisk ? (
          <RiskIcon className='icon' />
        ) : (
          <GrowthIcon className='icon' />
        )}
      </div>
      <p>{message}</p>
    </div>
  );
};

const growthMessages = [
  {
    message:
      'Apple products will continue to thrive as the world transforms into the digital society.',
  },
];
const riskMessages = [
  {
    message:
      'Apple is rumored to be working on AR/VR devices. It could be a massive hit or failure.',
  },
  {
    message:
      'Apple is rumored to be working on electric cars but they might be too late into the game as Tesla has been leading the market for over a decade.',
  },
];

const Layer3 = () => {
  return (
    <div className='layer-3'>
      <div className='message'>
        <h6>Growth Opportunities</h6>
        {growthMessages.map(({ message }) => (
          <IconMessage message={message} />
        ))}
      </div>
      <div className='message'>
        <h6>Potential Risks</h6>
        {riskMessages.map(({ message }) => (
          <IconMessage isRisk={true} message={message} />
        ))}
      </div>
    </div>
  );
};

const Overview = ({ ...rest }) => {
  return (
    <OverviewBlock {...rest}>
      <h3>Overview</h3>
      <div className='overview-content-wrapper'>
        <Layer1 />
        <Layer2 />
        <Layer3 />
      </div>
    </OverviewBlock>
  );
};

export default Overview;
