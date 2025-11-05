import 'dotenv/config';

export default {
  expo: {
    name: 'tmdb-app',
    slug: 'tmdb-app',
    version: '1.0.0',
    orientation: 'portrait',
    extra: {
      TMDB_API_TOKEN: process.env.TMDB_API_TOKEN,
    },
  },
};