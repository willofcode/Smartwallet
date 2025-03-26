import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //this will pull from the .env

  });

  export default api;
  
  