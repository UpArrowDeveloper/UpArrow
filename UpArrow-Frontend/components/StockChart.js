const StockChart = ({ stockChartUrl }) => {
  return (
    <iframe
      key={stockChartUrl}
      frameBorder='0'
      scrolling='no'
      width='800'
      height='420'
      src={stockChartUrl}
    ></iframe>
  );
};

export default StockChart;
