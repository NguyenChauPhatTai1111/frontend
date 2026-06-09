import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchTracks } from '@/hooks/spotify.service';

const genreMap: Record<string, string> = {
  '1': 'vietnamese pop',
  '2': 'us uk pop',
  '3': 'kpop',
  '4': 'vietnam rap',
  '5': 'edm',
  '6': 'lofi',
};

const genreNames: Record<string, string> = {
  '1': 'Nhạc Trẻ',
  '2': 'US-UK',
  '3': 'K-Pop',
  '4': 'Rap Việt',
  '5': 'EDM',
  '6': 'Lo-fi',
};

export const MusicGenreDetail = () => {
  console.log('MusicGenreDetail render');
  const { id } = useParams();

  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect running');
    fetchTracks();
  }, [id]);

  const fetchTracks = async () => {
    try {
      setLoading(true);

      const keyword = genreMap[id ?? '1'];

      const res = await searchTracks(keyword);

      setTracks(res.data ?? []);

      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#170f23',
        p: 4,
      }}
    >
      <Typography variant="h4" color="white" fontWeight={700} mb={4}>
        {genreNames[id ?? '1']}
      </Typography>

      {loading && <CircularProgress />}

      <Stack spacing={2}>
        {tracks.map((track) => (
          <Card
            key={track.id}
            sx={{
              bgcolor: '#2a213a',
              color: '#fff',
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={track.album?.cover_medium}
                  variant="rounded"
                  sx={{
                    width: 64,
                    height: 64,
                  }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>{track.title}</Typography>

                  <Typography variant="body2" color="gray">
                    {track.artist?.name}
                  </Typography>
                </Box>

                {track.preview && (
                  <audio
                    controls
                    src={track.preview}
                    style={{
                      width: 250,
                    }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
