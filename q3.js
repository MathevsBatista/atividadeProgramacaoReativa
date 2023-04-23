const fetch = require('node-fetch').default;

const url = 'https://dummyjson.com/products/';

const getRandomProductId = () => Math.floor(Math.random() * 100) + 1;

const start = async () => {
  while (true) {
    const productId = getRandomProductId();
    const url = `${url}${productId}`;
    console.log(`Random product id: ${productId}`);
    let notThree = 0;
    let answer;

    do {
      notThree++;
      try {
        answer = await fetch(url);
        if (!answer.ok) {
          throw new Error(`Erro: ${answer.status}`);
        }
        break;
      } catch (err) {
        if (notThree === 3) {
          console.error(`Erro ao requisitar o URL ${url}`);
        } else {
          console.warn(`Erro ao requisitar o URL ${url}`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    } while (notThree < 3);

    if (answer) {
      const data = await answer.json();
      console.log(data);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
  }
};

start();

