// src/api/client.js
import axios from 'axios';

// Backend API temel URL'i
// Gerekirse .env veya hardcode olarak değiştirin
const client = axios.create({
  baseURL: 'https://ceng316-project-production-85ee.up.railway.app',
});

export default client;
