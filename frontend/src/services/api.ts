import axios from 'axios';
console.log('teste');
export const api = axios.create({
  baseURL: 'https://my-amazona-victor.herokuapp.com/api',
});
