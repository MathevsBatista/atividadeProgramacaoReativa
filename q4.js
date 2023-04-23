const { from, interval, of } = require('rxjs');
const { map, mergeMap, catchError, takeUntil, switchMap, delay } = require('rxjs/operators');

const fetch = require('node-fetch').default;

const url = 'https://dummyjson.com/products/';

// Gera um número aleatório entre min e max
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const fetchProduct = (productId) => {
  const url = `${url}${productId}`;
  return fetch(url)
    .then(answer => {
      if (!answer.ok) {
        throw new Error(`Erro: ${answer.status}`);
      }
      return answer.json();
    });
}

const randomProducts = () => {
  const source$ = interval(10000).pipe(
    switchMap(() => {
      const productId = randomIntFromInterval(1, 100);
      return from(fetchProduct(productId));
    }),
    takeUntil(of(true).pipe(
      delay(15000)
    ))
  );

  source$.subscribe(
    data => console.log(data),
    err => console.error(err),
    () => console.log('Stream finalizada')
  );
}

randomProducts();

