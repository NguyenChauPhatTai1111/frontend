import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  keyframes,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import { useDelete, useList } from '@refinedev/core';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useState } from 'react';

type Track = {
  id?: number | string;
  title?: string;
  artist?: { name?: string } | string | null;
  album?: { cover_medium?: string } | null;
  preview?: string | null;
};
export const MyMusic = () => {
  const { query, result } = useList({
    resource: 'favorite-music',
  });

  const isLoading = query?.isLoading ?? false;
  const refetch = query?.refetch ?? (() => Promise.resolve());
  const responseData = (result as any)?.data;
  const songs = Array.isArray(responseData?.data)
    ? responseData.data
    : Array.isArray(responseData)
      ? responseData
      : [];
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

  const { mutate: deleteOne } = useDelete();
  const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

  // const songs = result.result?.data?.data ?? [];

  console.log('songs:', songs);

  if (isLoading) return <div>Loading...</div>;
  // console.log(result);
  // console.log(result.result);
  // console.log(result.result.data);
  // console.log(result.result.data.data);
  return (
    <>
      <Box>
        <Typography variant="h4" fontWeight={700} mb={3}>
          ❤️ My Music
        </Typography>

        <Stack spacing={2}>
          {songs.map((song: any) => (
            <Card
              key={song.id}
              onClick={() => {
                setCurrentTrack(song);
                setIsPlaying(true);
              }}
              sx={{
                bgcolor: '#2a213a',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={song.cover || undefined}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />

                  <Box flex={1}>
                    <Typography fontWeight={700}>{song.title}</Typography>

                    <Typography color="gray">
                      {song.artist || 'Unknown artist'}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() =>
                      deleteOne(
                        {
                          resource: 'favorite-music',
                          id: song.id,
                        },
                        {
                          onSuccess: () => refetch(),
                        },
                      )
                    }
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
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
            <GridCloseIcon />
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
            src={currentTrack.preview ?? undefined}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </Box>
      )}
    </>
  );
};
