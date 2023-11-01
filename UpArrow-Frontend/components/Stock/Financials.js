import styled from "@emotion/styled";
import color from "../../styles/color";
import { mobileWidth } from "../../styles/responsive";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Body14Bold,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../styles/typography";

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

const getData = (values) => {
  const labels = values.map(({ year }) => year);
  const data = values.map(({ value }) => value);
  return {
    labels,
    datasets: [
      {
        label: "label",
        data,
        backgroundColor: color.UpArrow_Blue,
      },
    ],
  };
};

const Financials = ({ analysis, ...restProps }) => {
  return (
    <FinancialsBlock {...restProps}>
      <h3>Financials</h3>
      <div className="chart-wrapper">
        {analysis.financials?.map(({ name, chartValues }) => {
          return (
            <div className="chart">
              <h6>{name}</h6>
              <div className="bar-wrapper">
                <Bar options={options} data={getData([...chartValues])} />
              </div>
            </div>
          );
        })}
      </div>
    </FinancialsBlock>
  );
};

const FinancialsBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid rgba(0 0 0 / 10%);
  border-radius: 1.6rem;
  margin-left: 3.2rem;

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
    width: 100% !important;
    grid-template-columns: 40% 40%;
    grid-gap: 10rem;

    .chart {
      margin: 0.8rem 0;
    }
  }

  .bar-wrapper {
    // width: 28.2rem;
    //height: 14.6rem;
  }

  @media screen and (max-width: ${mobileWidth}) {
    padding: 0;
    border: none;

    h3 {
      ${HeadH5Bold}
      margin-bottom: 0.8rem;
    }

    h6 {
      ${Body14Bold}
    }

    .chart-wrapper {
      grid-template-columns: 80%;
      border-bottom: 0.05rem solid rgba(0 0 0 / 10%);
      margin-bottom: 2rem;
      grid-gap: 1.6rem;
      padding-bottom: 1rem;
    }

    .bar-wrapper {
      width: 100%;
      height: 18rem;
    }
  }
`;

export default Financials;
