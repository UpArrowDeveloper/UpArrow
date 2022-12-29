const ObjectTable = ({
  tickers,
  prices,
  setConfigData,
  type = 'number',
  property,
}) => {
  return (
    <table>
      <tbody>
        {prices.map((price, index) => (
          <tr key={index}>
            <td>{tickers[index]}</td>
            <td>
              <input
                type={type}
                value={price}
                onChange={(e) => {
                  setConfigData((config) => ({
                    ...config,
                    [property]: {
                      ...config[property],
                      [tickers[index]]:
                        type === 'number'
                          ? e.target.valueAsNumber
                          : e.target.value,
                    },
                  }));
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ObjectTable;
