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
