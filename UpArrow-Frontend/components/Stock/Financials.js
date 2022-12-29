import styled from '@emotion/styled';
import color from '../../styles/color';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { HeadH3Bold, HeadH6Bold } from '../../styles/typography';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = [2018, 2019, 2020, 2021, 2022];

const data = {
  labels,
  datasets: [
    {
      label: 'label',
      data: [298, 150, 320, 205, 330],
      backgroundColor: color.UpArrow_Blue,
    },
  ],
};

const FinancialsBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;

  h3 {
    ${HeadH3Bold}
    margin-bottom: 2.3rem;
  }
  h6 {
    ${HeadH6Bold}
    margin-bottom: 0.8rem;
  }

  .chart-wrapper {
    display: grid;
    grid-template-columns: 50% 50%;
  }
  .bar-wrapper {
    width: 28.2rem;
    height: 14.6rem;
  }
`;

const Financials = ({ ...restProps }) => {
  return (
    <FinancialsBlock {...restProps}>
      <h3>Financials</h3>
      <div className='chart-wrapper'>
        <div className='chart'>
          <h6>Revenue</h6>
          <div className='bar-wrapper'>
            <Bar options={options} data={data} />
          </div>
        </div>
        <div className='chart'>
          <h6>Net Income</h6>
          <div className='bar-wrapper'>
            <Bar options={options} data={data} />
          </div>
        </div>
        <div className='chart'>
          <h6>Total Assets</h6>
          <div className='bar-wrapper'>
            <Bar options={options} data={data} />
          </div>
        </div>
        <div className='chart'>
          <h6>Net Operating Cash Flow</h6>
          <div className='bar-wrapper'>
            <Bar options={options} data={data} />
          </div>
        </div>
      </div>
    </FinancialsBlock>
  );
};

export default Financials;
