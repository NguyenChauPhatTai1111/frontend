import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { getMovieDetail } from '@/hooks/spotify.service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const MovieDetail = () => {
  const { slug } = useParams();

  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadMovie = async () => {
      try {
        const res = await getMovieDetail(slug);

        setMovie(res.movie);

        const episodeList = res.episodes?.[0]?.server_data ?? [];

        setEpisodes(episodeList);

        if (episodeList.length > 0) {
          setCurrentEpisode(episodeList[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [slug]);

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: '#020617',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box p={5}>
        <Typography>Movie not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          height: 500,
          position: 'relative',
          backgroundImage: `url(${movie.thumb_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,.2), #020617)',
          }}
        />
      </Box>

      {/* Video */}
      {currentEpisode && (
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            px: 3,
            mt: -15,
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: 4,
              boxShadow: '0 20px 50px rgba(0,0,0,.6)',
            }}
          >
            <iframe
              title={currentEpisode.filename}
              src={currentEpisode.link_embed}
              width="100%"
              height="700"
              allowFullScreen
              frameBorder="0"
            />
          </Box>
        </Box>
      )}

      <Container maxWidth="xl">
        <Box mt={5}>
          <Box display="flex" gap={4} flexWrap="wrap">
            {/* Poster */}
            <Box
              component="img"
              src={movie.poster_url}
              alt={movie.name}
              sx={{
                width: {
                  xs: '100%',
                  md: 280,
                },
                maxWidth: 280,
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,.4)',
              }}
            />

            {/* Info */}
            <Box flex={1}>
              <Typography variant="h3" fontWeight={900} gutterBottom>
                {movie.name}
              </Typography>

              <Typography
                variant="h6"
                color="rgba(255,255,255,.7)"
                gutterBottom
              >
                {movie.origin_name}
              </Typography>

              <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                <Chip label={movie.year} color="primary" />

                <Chip label={movie.quality} color="success" />

                <Chip label={movie.lang} />

                <Chip label={movie.status} />

                <Chip label={movie.episode_current} />
              </Box>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,.85)',
                  mb: 4,
                }}
              >
                {movie.content?.replace(/<[^>]*>/g, '')}
              </Typography>

              {/* Category */}
              <Typography variant="h6" fontWeight={700} mb={1}>
                Thể loại
              </Typography>

              <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
                {movie.category?.map((item: any) => (
                  <Chip key={item.slug} label={item.name} variant="outlined" />
                ))}
              </Box>

              {/* Country */}
              <Typography variant="h6" fontWeight={700} mb={1}>
                Quốc gia
              </Typography>

              <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
                {movie.country?.map((item: any) => (
                  <Chip key={item.slug} label={item.name} variant="outlined" />
                ))}
              </Box>

              {/* Actors */}
              <Typography variant="h6" fontWeight={700} mb={1}>
                Diễn viên
              </Typography>

              <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
                {movie.actor?.map((actor: string) => (
                  <Chip key={actor} label={actor} variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Episodes */}
          <Box mt={6}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Danh sách tập phim
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {episodes.map((episode) => (
                <Chip
                  key={episode.slug}
                  label={`Tập ${episode.name}`}
                  clickable
                  onClick={() => {
                    setCurrentEpisode(episode);

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                  color={
                    currentEpisode?.slug === episode.slug
                      ? 'primary'
                      : 'default'
                  }
                  sx={{
                    height: 42,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
