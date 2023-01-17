const Stock = require('../../models/Stock');

const getStockById = async (stockId) => {
  const stock = await Stock.findById(stockId);
  return stock;
};

const getStockByIds = async (stockIds) => {
  return Promise.all(stockIds.map((id) => Stock.findById(id)));
};

const getStockTickerById = async (stockId) => {
  const stock = await Stock.findById(stockId);
  return stock.ticker;
};

module.exports = {
  getStockById,
  getStockByIds,
  getStockTickerById,
};
