import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Your backend URL - updated to match backend port
});

export default api;