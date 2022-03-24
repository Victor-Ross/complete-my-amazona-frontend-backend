import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://my-amazona-victor.herokuapp.com/api',
});
