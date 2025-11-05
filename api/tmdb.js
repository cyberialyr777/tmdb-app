import axios from 'axios';
import Constants from 'expo-constants';

const apiToken = Constants.expoConfig.extra.TMDB_API_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`
  }
});

export default apiClient;