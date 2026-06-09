import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { keyframes } from '@mui/system';

import { getTrendingTracks } from '@/hooks/spotify.service';
import { useList, useNotification } from '@refinedev/core';

type FavoriteRecord = {
  id?: number | string;
  track_id?: string;
  trackId?: string;
};

type Track = {
  id?: number | string;
  title?: string;
  artist?: { name?: string } | string | null;
  album?: { cover_medium?: string } | null;
  preview?: string | null;
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const genres = [
  {
    id: 1,
    name: 'Nhạc Trẻ',
    image: 'https://picsum.photos/500/300?random=1',
    songs: 1523,
  },
  {
    id: 2,
    name: 'US-UK',
    image: 'https://picsum.photos/500/300?random=2',
    songs: 856,
  },
  {
    id: 3,
    name: 'K-Pop',
    image: 'https://picsum.photos/500/300?random=3',
    songs: 634,
  },
  {
    id: 4,
    name: 'Rap Việt',
    image: 'https://picsum.photos/500/300?random=4',
    songs: 325,
  },
  {
    id: 5,
    name: 'EDM',
    image: 'https://picsum.photos/500/300?random=5',
    songs: 420,
  },
  {
    id: 6,
    name: 'Lo-fi',
    image: 'https://picsum.photos/500/300?random=6',
    songs: 210,
  },
];

export const MusicGenreList = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { query, result } = useList({
    resource: 'favorite-music',
  });
  const { open } = useNotification();

  const favoriteMap = useMemo(() => {
    const favoriteRecords: FavoriteRecord[] = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.data?.data)
        ? result.data.data
        : [];

    return new Map(
      favoriteRecords.map((item: FavoriteRecord) => [
        String(item?.track_id ?? item?.trackId ?? item?.id ?? ''),
        item?.id,
      ]),
    );
  }, [result?.data]);
  const favoriteSet = useMemo(
    () => new Set(Array.from(favoriteMap.keys())),
    [favoriteMap],
  );

  // =========================
  // TOGGLE FAVORITE
  // =========================
  const toggleFavorite = async (track: Track) => {
    const trackId = String(track.id);
    const isLiked = favoriteSet.has(trackId);

    try {
      if (isLiked) {
        const favoriteId = favoriteMap.get(trackId);

        if (!favoriteId) {
          throw new Error(`Favorite record for track ${trackId} not found`);
        }

        const response = await fetch(
          `http://localhost:8000/api/favorite-music/${favoriteId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Không thể xóa yêu thích. Vui lòng thử lại.');
        }

        open?.({
          type: 'success',
          message: 'Xóa yêu thích',
          description: `${track.title ?? 'Bài hát'} đã được xóa khỏi danh sách yêu thích.`,
        });
      } else {
        const response = await fetch(
          `http://localhost:8000/api/favorite-music`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
              track_id: trackId,
              title: track.title,
              artist:
                typeof track.artist === 'string'
                  ? track.artist
                  : track.artist?.name,
              cover: track.album?.cover_medium,
              preview: track.preview,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Không thể thêm yêu thích. Vui lòng thử lại.');
        }

        open?.({
          type: 'success',
          message: 'Thêm yêu thích',
          description: `${track.title ?? 'Bài hát'} đã được thêm vào danh sách yêu thích.`,
        });
      }

      // 🔥 sync lại DB sau khi change
      await query.refetch();
    } catch (err) {
      console.log(err);
      open?.({
        type: 'error',
        message: 'Lỗi yêu thích',
        description:
          err instanceof Error
            ? err.message
            : 'Có lỗi xảy ra khi cập nhật danh sách yêu thích.',
      });
    }
  };

  // =========================
  // LOAD TRACKS
  // =========================
  useEffect(() => {
    const loadChart = async () => {
      const res = await getTrendingTracks();
      setTracks(res.data ?? []);
    };

    loadChart();
  }, []);

  return (
    <>
      {/* ================= TOP TRENDING ================= */}
      <Box>
        <Typography variant="h5" color="white" fontWeight={700} mb={2}>
          🔥 Top Trending
        </Typography>

        <Stack spacing={2}>
          {tracks.slice(0, 10).map((track, index) => {
            const trackId = String(track.id);
            const isLiked = favoriteSet.has(trackId);

            return (
              <Card
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
                sx={{
                  bgcolor: '#2a213a',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                      sx={{
                        width: 40,
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#9b4dff',
                      }}
                    >
                      #{index + 1}
                    </Typography>

                    <Avatar
                      src={track.album?.cover_medium}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />

                    <Stack
                      flex={1}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography fontWeight={600}>{track.title}</Typography>
                        <Typography color="gray">
                          {typeof track.artist === 'string'
                            ? track.artist
                            : track.artist?.name}
                        </Typography>
                      </Box>

                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track);
                        }}
                      >
                        {isLiked ? (
                          <FavoriteIcon sx={{ color: '#ff4081' }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ color: '#ff4081' }} />
                        )}
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      {/* ================= GENRE LIST ================= */}
      <Box sx={{ backgroundColor: '#170f23', minHeight: '100vh', p: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#fff" mb={4}>
          Thể Loại Nhạc
        </Typography>

        <Grid container spacing={3}>
          {genres.map((genre) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={genre.id}>
              <Card
                onClick={() =>
                  navigate(`/music-genres/${genre.id}`, {
                    state: genre,
                  })
                }
                sx={{
                  background: '#2a213a',
                  borderRadius: 4,
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <CardMedia component="img" height="180" image={genre.image} />

                <CardContent>
                  <Typography variant="h6" color="#fff">
                    {genre.name}
                  </Typography>

                  <Chip
                    size="small"
                    label={`${genre.songs} bài`}
                    sx={{ bgcolor: '#3b2f52', color: '#fff' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= PLAYER ================= */}
      {currentTrack && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: '#1e1e1e',
            borderRadius: 4,
            p: 2,
            width: 420,
            zIndex: 9999,
          }}
        >
          <IconButton
            onClick={() => {
              setCurrentTrack(null);
              setIsPlaying(false);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#fff',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              animation: isPlaying ? `${spin} 3s linear infinite` : 'none',
            }}
          >
            <img
              src={currentTrack.album?.cover_medium}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>

          <Typography color="white">{currentTrack.title}</Typography>

          <audio
            controls
            autoPlay
            src={currentTrack.preview}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </Box>
      )}
    </>
  );
};
