import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost/api',
});

export function setAxiosToken(token: string) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}