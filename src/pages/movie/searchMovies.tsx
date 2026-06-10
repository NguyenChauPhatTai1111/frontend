import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { getMovies, searchMoviesApi } from '@/hooks/spotify.service';
interface SearchMovieProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}
const SearchMovie = ({ keyword, setKeyword }: SearchMovieProps) => {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        if (!keyword.trim()) {
          const res = await getMovies();

          setMovies(res.items ?? res.data?.items ?? []);

          return;
        }

        const res = await searchMoviesApi(keyword);

        setMovies(res.data?.items ?? []);
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <TextField
      fullWidth
      placeholder="🔍 Tìm kiếm phim..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      sx={{
        mb: 3,
        '& .MuiOutlinedInput-root': {
          bgcolor: '#1e293b',
          color: '#fff',
          borderRadius: 3,
        },
      }}
    />
  );
};

export default SearchMovie;
