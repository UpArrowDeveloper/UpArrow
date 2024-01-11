const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();

const httpClient = axios.create({
  baseURL: process.env.API_URI,
});

const getCurrentExchangeRate = async () => {
  try {
    const response = await axios.get(
      "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD"
    );
    const { basePrice } = response.data[0];
    return basePrice;
  } catch (error) {
    console.error(error);
  }
};

const getPage = async (ticker) => {
  try {
    const pageHtml = (
      await axios.get(
        `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=${ticker}+주가`
      )
    ).data;
    return pageHtml;
  } catch (error) {
    throw error;
  }
};

const changePrice = async (id, stock) => {
  try {
    const res = await httpClient.put(`/api/v1/stock/${id}`, {
      ...stock,
    });
    console.log("stock : ", stock);
  } catch (error) {
    console.error("change error : ", error);
  }
};

const parsePrice = (priceString) => {
  let res = 0;
  if (priceString.includes("조")) {
    res += Number(priceString.split("조")[0]) * 1000000000000;
    priceString = priceString.split("조")[1];
  }
  if (priceString.includes("억")) {
    res += Number(priceString.split("억")[0]) * 100000000;
    priceString = priceString.split("억")[1];
  }
  if (priceString.includes("만")) {
    res += Number(priceString.split("만")[0]) * 10000;
    priceString = priceString.split("만")[1];
  }
  if (priceString.length > 0) {
    res += Number(priceString);
  }
  return res;
};

const getPrice = async (ticker) => {
  const $ = cheerio.load(await getPage(ticker));
  const result = $(".spt_tlt .spt_con > strong");
  const totalPrice = $(".txt_5 dd .text");
  const total = [...totalPrice][0].children[0].data?.replace(",", "");
  const parsedTotal = parsePrice(total);

  return [
    ticker,
    [...result][0].children[0].data?.replace(",", ""),
    Math.floor(parsedTotal),
  ];
};

const parseHtml = async () => {
  const stocks = (await httpClient.get("/api/v1/stock")).data;

  const priceListPromises = [];
  const exchangeRate = await getCurrentExchangeRate();
  console.log("exchangeRate : ", exchangeRate);
  stocks.forEach((stock) => {
    priceListPromises.push(getPrice(stock.ticker));
  });

  try {
    const priceList = await Promise.all(priceListPromises);
    const res = priceList.map(([ticker, price, totalPrice], idx) => {
      return changePrice(stocks[idx]._id, {
        currentPrice: Number(price),
        marketCap: Math.floor(totalPrice / exchangeRate),
      });
    });
    const result = await Promise.all(res);
    // const priceObject = priceList.reduce((acc, [ticker, price]) => {
    //   return {
    //     ...acc,
    //     [ticker]: Number(price),
    //   };
    // }, {});
    // await changePrice(priceObject);
    console.log("res : ", result);
  } catch (error) {
    console.error(error);
  }
};
parseHtml();

// setInterval(() => {
//   try {
//     parseHtml();
//   } catch (error) {
//     console.error('fetch failed', error);
//     exit();
//   }
// }, 10000);

// $('h2.title').text('Hello there!');
// $('h2').addClass('welcome');

// $.html();
//=> <html><head></head><body><h2 class="title welcome">Hello there!</h2></body></html>
