import axios from 'axios';
console.log('teste');
export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});
