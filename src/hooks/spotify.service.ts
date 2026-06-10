// services/spotify.service.ts

// services/music.service.ts

export const searchTracks = async (keyword: string) => {
  const response = await fetch(
    `http://localhost:8000/api/music/search?q=${encodeURIComponent(keyword)}`,
  );

  if (!response.ok) {
    throw new Error('Music API Error');
  }

  return response.json();
};

export const getTrendingTracks = async () => {
  const response = await fetch('http://localhost:8000/api/music/chart');

  if (!response.ok) {
    throw new Error('Chart API Error');
  }

  return response.json();
};

export const getMovies = async () => {
  const response = await fetch('http://localhost:8000/api/movies?page=1');

  if (!response.ok) {
    throw new Error('Chart API Error');
  }

  return response.json();
};

export const getMoviesByCountry = async (country: string, page = 1) => {
  const response = await fetch(
    `http://localhost:8000/api/movies/country/${country}?page=${page}`,
  );

  if (!response.ok) {
    throw new Error('Get movies by country failed');
  }

  return response.json();
};

export const getMovieDetail = async (slug: string) => {
  const response = await fetch(`http://localhost:8000/api/movies/${slug}`);

  if (!response.ok) {
    throw new Error('Movie detail error');
  }

  return response.json();
};

export const searchMoviesApi = async (keyword: string, page = 1) => {
  const response = await fetch(
    `http://localhost:8000/api/movies/search?keyword=${encodeURIComponent(
      keyword,
    )}&page=${page}`,
  );

  if (!response.ok) {
    throw new Error('Search movies failed');
  }

  return response.json();
};

export const getMoviesByCategory = async (category: string) => {
  const response = await fetch(
    `http://localhost:8000/api/movies/category/${category}`,
  );

  if (!response.ok) {
    throw new Error('Category API Error');
  }

  return response.json();
};

export const fetchTrailer = async (tmdbId: string, type: 'movie' | 'tv') => {
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=YOUR_KEY`,
  );
  const data = await res.json();

  const trailer = data.results.find(
    (v: any) => v.type === 'Trailer' && v.site === 'YouTube',
  );

  return trailer?.key;
};
