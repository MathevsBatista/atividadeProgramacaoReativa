const { from, interval } = require('rxjs');
const { switchMap, catchError, map, bufferCount } = require('rxjs/operators');
const fetch = require('node-fetch').default;

const url = 'https://dummyjson.com/products/';
const maxTries = 3;

const getRandomProductId = () => Math.floor(Math.random() * 100) + 1;

const productStream$ = interval(10000).pipe(
  map(() => getRandomProductId()),
  switchMap(productId => from(getProductData(productId))),
  catchError(err => {
    console.error(`Erro ao requisitar o URL: ${err.message}`);
    return from([]);
  }),
  bufferCount(3),
  map(products => {
    const prices = products.map(product => product.price);
    const averagePrice = prices.reduce((acc, curr) => acc + curr, 0) / prices.length;
    return {
      products,
      averagePrice
    };
  })
);

async function getProductData(productId) {
  let notThree = 0;
  let answer;

  do {
    notThree++;
    try {
      answer = await fetch(`${url}${productId}`);
      if (!answer.ok) {
        throw new Error(`Erro: ${answer.status}`);
      }
      break;
    } catch (err) {
      if (notThree === maxTries) {
        throw new Error(`Erro ao requisitar o URL ${url}${productId}`);
      } else {
        console.warn(`Erro ao requisitar o URL ${url}${productId}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  } while (notThree < maxTries);

  if (answer) {
    const data = await answer.json();
    return data;
  }

  return null;
}

productStream$.subscribe(({ products, averagePrice }) => {
  console.log(`Produtos: ${JSON.stringify(products)}`);
  console.log(`Média de preço dos últimos 3 produtos: ${averagePrice}`);
});

