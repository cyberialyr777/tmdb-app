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

/**
 * Search movies by text query using TMDB API.
 * @param {string} query - Search text. Must be non-empty.
 * @param {number} [page=1] - Page number (1-1000)
 * @param {string} [language='es-ES'] - Language code for localized fields
 * @returns {Promise<{ page: number, total_pages: number, total_results: number, results: any[] }>} TMDB paginated response
 */
export const searchMovies = async (query, page = 1, language = 'es-ES') => {
  if (!query || !query.trim()) {
    return { page: 1, total_pages: 0, total_results: 0, results: [] };
  }
  const { data } = await apiClient.get('/search/movie', {
    params: {
      query: query.trim(),
      include_adult: false,
      page,
      language,
    },
  });
  return data;
};

/**
 * Build a TMDB image URL for posters/backdrops.
 * @param {string|null} path - the `poster_path` or `backdrop_path`
 * @param {('w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original')} size - image size
 */
export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;

export default apiClient;