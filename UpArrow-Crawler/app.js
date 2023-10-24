const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();

const httpClient = axios.create({
  baseURL: process.env.API_URI,
});

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
  } catch (error) {
    console.error("change error : ", error);
  }
};

const getPrice = async (ticker) => {
  const $ = cheerio.load(await getPage(ticker));
  const result = $(".spt_tlt .spt_con > strong");
  return [ticker, [...result][0].children[0].data];
};

const parseHtml = async () => {
  const stocks = (await httpClient.get("/api/v1/stock")).data;

  const priceListPromises = [];

  stocks.forEach((stock) => {
    priceListPromises.push(getPrice(stock.ticker));
  });

  try {
    const priceList = await Promise.all(priceListPromises);
    const res = priceList.map(([ticker, price], idx) => {
      return changePrice(stocks[idx]._id, {
        currentPrice: Number(price),
      });
    });
    await Promise.all(res);
    // const priceObject = priceList.reduce((acc, [ticker, price]) => {
    //   return {
    //     ...acc,
    //     [ticker]: Number(price),
    //   };
    // }, {});
    // await changePrice(priceObject);
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
