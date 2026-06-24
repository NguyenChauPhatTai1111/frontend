import {
  Box,
  Card,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import {
  getMovies,
  getMoviesByCountry,
  searchMoviesApi,
} from '@/hooks/spotify.service';
import { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchMovie from './searchMovies';
import CategoryMovie from './categoryMovies';

export const IMAGE_THUMB_URL = 'https://img.ophim.live/uploads/movies/';

export const MoviesList = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [country, setCountry] = useState('all');

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        if (!keyword.trim()) {
          const res =
            country === 'all'
              ? await getMovies()
              : await getMoviesByCountry(country);

          setMovies(res.data?.items ?? res.items ?? []);
          return;
        }

        const res = await searchMoviesApi(keyword);

        console.log('SEARCH', res);

        setMovies(res.data?.items ?? []);
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <Box
      sx={{
        minHeight: '100vh',

        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: 'relative',
          height: {
            xs: 400,
            md: 650,
          },
          borderRadius: 6,
          overflow: 'hidden',
          mb: 8,
          boxShadow: '0 30px 60px rgba(0,0,0,.5)',
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/V_p3qpDUuz4?autoplay=1&mute=1"
            title="YouTube trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 0 }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            left: {
              xs: 20,
              md: 60,
            },
            bottom: {
              xs: 40,
              md: 80,
            },
            maxWidth: 650,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 40,
                md: 80,
              },
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            MOVIE HUB
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,.8)',
              mt: 2,
              fontSize: {
                xs: 14,
                md: 18,
              },
            }}
          >
            Khám phá hàng nghìn bộ phim chất lượng cao được cập nhật liên tục từ
            Ophim với trải nghiệm xem phim hiện đại.
          </Typography>

          <Stack direction="row" spacing={3} mt={4}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              sx={{
                bgcolor: '#fff',
                color: '#000',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#e5e5e5',
                },
              }}
            >
              Xem Ngay
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<InfoOutlinedIcon />}
              sx={{
                bgcolor: 'rgba(255,255,255,.15)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
              }}
            >
              Thông Tin
            </Button>
          </Stack>

          <Box mt={3}>
            <Chip
              label={`${movies.length} Movies`}
              sx={{
                bgcolor: '#ef4444',
                color: '#fff',
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* TITLE */}
      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: 800,
          mb: 4,
        }}
      >
        🔥 Phim Mới Cập Nhật
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 6,
          mt: 4,
        }}
      >
        <Chip
          label="🌎 Tất cả"
          clickable
          color={country === 'all' ? 'primary' : 'default'}
          onClick={() => setCountry('all')}
          sx={{
            fontWeight: 700,
            height: 40,
          }}
        />

        <Chip
          label="🇻🇳 Việt Nam"
          clickable
          color={country === 'viet-nam' ? 'primary' : 'default'}
          onClick={() => setCountry('viet-nam')}
          sx={{
            fontWeight: 700,
            height: 40,
          }}
        />

        <Chip
          label="🇰🇷 Hàn Quốc"
          clickable
          color={country === 'han-quoc' ? 'primary' : 'default'}
          onClick={() => setCountry('han-quoc')}
          sx={{
            fontWeight: 700,
            height: 40,
          }}
        />

        <Chip
          label="🇯🇵 Nhật Bản"
          clickable
          color={country === 'nhat-ban' ? 'primary' : 'default'}
          onClick={() => setCountry('nhat-ban')}
          sx={{
            fontWeight: 700,
            height: 40,
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 6,
          mt: 4,
        }}
      >
        <SearchMovie keyword={keyword} setKeyword={setKeyword} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 6,
          mt: 4,
        }}
      >
        <CategoryMovie
          setMovies={setMovies}
          category={category}
          setCategory={setCategory}
        />
      </Box>

      {/* MOVIES */}
      <Grid
        container
        spacing={{
          xs: 2,
          md: 4,
        }}
      >
        {movies.map((movie: any, index) => (
          <Card onClick={() => navigate(`/movies/${movie.slug}`)}>
            <Grid
              key={movie.slug ?? index}
              size={{
                xs: 6,
                sm: 4,
                md: 3,
                lg: 2.4,
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    bgcolor: '#111827',
                    cursor: 'pointer',
                    transition: '.35s',
                    boxShadow: '0 10px 25px rgba(0,0,0,.35)',

                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,.7)',
                    },

                    '&:hover .overlay': {
                      opacity: 1,
                    },

                    '&:hover img': {
                      transform: 'scale(1.08)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`${IMAGE_THUMB_URL}/${movie.thumb_url}`}
                    alt={movie.name}
                    sx={{
                      height: 360,
                      objectFit: 'cover',
                      transition: '.5s',
                    }}
                  />

                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      transition: '.3s',
                      background: `
                        linear-gradient(
                        to top,
                        rgba(0,0,0,.95),
                        rgba(0,0,0,.5),
                        transparent
                    )
                    `,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 800,
                        mb: 1,
                      }}
                    >
                      {movie.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,.7)',
                        mb: 2,
                        fontSize: 13,
                      }}
                      noWrap
                    >
                      {movie.origin_name}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {movie.year && (
                        <Chip
                          size="small"
                          label={movie.year}
                          sx={{
                            bgcolor: '#2563eb',
                            color: '#fff',
                          }}
                        />
                      )}

                      {movie.quality && (
                        <Chip
                          size="small"
                          label={movie.quality}
                          sx={{
                            bgcolor: '#16a34a',
                            color: '#fff',
                          }}
                        />
                      )}

                      {movie.lang && (
                        <Chip
                          size="small"
                          label={movie.lang}
                          sx={{
                            bgcolor: '#7c3aed',
                            color: '#fff',
                          }}
                        />
                      )}

                      <Chip
                        size="small"
                        label="⭐ 8.8"
                        sx={{
                          bgcolor: '#f59e0b',
                          color: '#fff',
                        }}
                      />
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
