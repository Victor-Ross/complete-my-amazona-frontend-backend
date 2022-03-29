import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://my-amazona-victor.herokuapp.com'
    : 'http://localhost:3333',
});
