import { useEffect } from 'react';
import { getMovies, getMoviesByCategory } from '@/hooks/spotify.service';
import { Chip, Box } from '@mui/material';
interface CategoryMovieProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
}
const CategoryMovie = ({
  category,
  setCategory,
  setMovies,
}: CategoryMovieProps) => {
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ALL
        if (category === 'all') {
          const res = await getMovies();
          setMovies(res.data?.items ?? res.items ?? []);
          return;
        }

        // CATEGORY
        const res = await getMoviesByCategory(category);
        setMovies(res.data?.items ?? res.items ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category, setMovies]);

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
      <Chip
        label="🎬 Tất cả"
        clickable
        color={category === 'all' ? 'primary' : 'default'}
        onClick={() => setCategory('all')}
      />

      <Chip
        label="👻 Kinh Dị"
        clickable
        color={category === 'kinh-di' ? 'primary' : 'default'}
        onClick={() => setCategory('kinh-di')}
      />

      <Chip
        label="💥 Hành Động"
        clickable
        color={category === 'hanh-dong' ? 'primary' : 'default'}
        onClick={() => setCategory('hanh-dong')}
      />

      <Chip
        label="❤️ Tình Cảm"
        clickable
        color={category === 'tinh-cam' ? 'primary' : 'default'}
        onClick={() => setCategory('tinh-cam')}
      />

      <Chip
        label="👨‍👩‍👧 Gia Đình"
        clickable
        color={category === 'gia-dinh' ? 'primary' : 'default'}
        onClick={() => setCategory('gia-dinh')}
      />
    </Box>
  );
};

export default CategoryMovie;
