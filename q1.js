const url = 'https://jsonplaceholder.typicode.com/users/';

function fetchUser(id) {
  return fetch(`${url}${id}`).then(response => response.json());
}

async function fetchUsers() {
  for (let id = 1; id <= 10; id++) {
    const user = await fetchUser(id);
    console.log(user);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

fetchUsers();

