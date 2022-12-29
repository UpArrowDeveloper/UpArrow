const cheerio = require('cheerio');
const axios = require('axios');

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

const changePrice = async (data) => {
  try {
    const res = await axios.put('http://localhost:4000/api/v1/config', {
      prices: data,
    });
  } catch (error) {
    console.error('change error : ', error);
  }
};

const getPrice = async (ticker) => {
  const $ = cheerio.load(await getPage(ticker));
  const result = $('#_cs_root .spt_tlt .spt_con > strong');
  return [ticker, [...result][0].children[0].data];
};

const parseHtml = async () => {
  const stockList = [
    'TSLA',
    'AAPL',
    'AAPL',
    'TSLA',
    'RIVN',
    'AMZN',
    'LMND',
    'ATVI',
    'ADBE',
    'AEVA',
    'AFRM',
    'UAVS',
    'ABNB',
    'BABA',
    'AMD',
    'ARCH',
    'ARVL',
    'BYND',
    'BKSY',
    'GOEV',
    'CVNA',
    'GOOGL',
    'MSFT',
    'NIO',
    'NVDA',
  ];
  const priceListPromises = [];

  stockList.forEach((stock) => {
    priceListPromises.push(getPrice(stock));
  });

  try {
    const priceList = await Promise.all(priceListPromises);
    const priceObject = priceList.reduce((acc, [ticker, price]) => {
      return {
        ...acc,
        [ticker]: Number(price),
      };
    }, {});
    console.log('priceObject : ', priceObject);
    await changePrice(priceObject);
  } catch (error) {
    console.error(error);
  }
};

setInterval(() => {
  console.log('updated');
  try {
    parseHtml();
  } catch (error) {
    console.error('fetch failed', error);
    exit();
  }
}, 10000);

// $('h2.title').text('Hello there!');
// $('h2').addClass('welcome');

// $.html();
//=> <html><head></head><body><h2 class="title welcome">Hello there!</h2></body></html>
