const fetch = require('node-fetch').default;

const url = 'https://httpbin.org/status/';

const start = async () => {
  for (let i = 401; i <= 410; i++) {
    const url = `${url}${i}`;
    let notThree = 0;
    let answer;

    console.log(`Status code ${i}`)
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
      const data = await answer.text();
      console.log(data);
    }
  }
};

start();

