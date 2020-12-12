import axios from 'axios';

const api = axios.create();

api.interceptors.request.use(async (config) => {
  const headers = {
    ...config.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return { ...config, headers };
});

export default api;
