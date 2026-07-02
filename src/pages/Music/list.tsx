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
  TextField,
  Slider,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { keyframes } from '@mui/system';

import { getTrendingTracks, searchTracks } from '@/hooks/spotify.service';
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
  audioUrl?: string | null;
  fullAudioUrl?: string | null;
  streamUrl?: string | null;
  sourceUrl?: string | null;
  file?: string | null;
  youtubeUrl?: string | null;
  youtubeVideoId?: string | null;
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

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '00:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const normalizeAudioUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `http://localhost:8000${trimmed}`;
  }

  return `http://localhost:8000/${trimmed.replace(/^\/+/, '')}`;
};

const getTrackAudioSource = (track: Track) => {
  const candidates = [
    track.audioUrl,
    track.fullAudioUrl,
    track.streamUrl,
    track.sourceUrl,
    track.file,
    track.preview,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeAudioUrl(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
};

type DrumType = 'kick' | 'snare' | 'hat';
type PatternMap = Record<DrumType, number[]>;
type PresetName = 'lofi' | 'trap' | 'house';

const stepCount = 16;

const createPattern = (source: PatternMap): PatternMap => ({
  kick: [...source.kick],
  snare: [...source.snare],
  hat: [...source.hat],
});

const initialPattern: PatternMap = {
  kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
};

const presets: Record<PresetName, { bpm: number; pattern: PatternMap }> = {
  lofi: {
    bpm: 78,
    pattern: createPattern({
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    }),
  },
  trap: {
    bpm: 95,
    pattern: createPattern({
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    }),
  },
  house: {
    bpm: 124,
    pattern: createPattern({
      kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    }),
  },
};

export const MusicGenreList = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [bpm, setBpm] = useState(presets.lofi.bpm);
  const [pattern, setPattern] = useState<PatternMap>(() =>
    createPattern(initialPattern),
  );
  const [activeStep, setActiveStep] = useState(0);
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);
  const [presetName, setPresetName] = useState<PresetName>('lofi');
  const [fullExperienceTrack, setFullExperienceTrack] = useState<Track | null>(
    null,
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeStepRef = useRef(0);
  const { query, result } = useList({
    resource: 'favorite-music',
  });
  const { open } = useNotification();

  const favoriteRecords = useMemo(() => {
    const responseData = (
      result as
        | { data?: FavoriteRecord[] | { data?: FavoriteRecord[] } }
        | undefined
    )?.data;
    if (Array.isArray(responseData)) {
      return responseData as FavoriteRecord[];
    }

    if (responseData && Array.isArray(responseData.data)) {
      return responseData.data as FavoriteRecord[];
    }

    return [] as FavoriteRecord[];
  }, [result]);

  const favoriteMap = useMemo(
    () =>
      new Map(
        favoriteRecords.map((item: FavoriteRecord) => [
          String(item?.track_id ?? item?.trackId ?? item?.id ?? ''),
          item?.id,
        ]),
      ),
    [favoriteRecords],
  );
  const favoriteSet = useMemo(
    () => new Set(Array.from(favoriteMap.keys())),
    [favoriteMap],
  );

  const activeTracks = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults;
    }

    return tracks;
  }, [searchResults, searchTerm, tracks]);

  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const playKick = useCallback(() => {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }, [ensureAudioContext]);

  const playSnare = useCallback(() => {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const noiseBuffer = ctx.createBuffer(
      1,
      ctx.sampleRate * 0.2,
      ctx.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    noise.buffer = noiseBuffer;
    noise.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.start(now);
    noise.stop(now + 0.2);
  }, [ensureAudioContext]);

  const playHat = useCallback(() => {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const noiseBuffer = ctx.createBuffer(
      1,
      ctx.sampleRate * 0.08,
      ctx.sampleRate,
    );
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    noise.buffer = noiseBuffer;
    noise.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noise.start(now);
    noise.stop(now + 0.08);
  }, [ensureAudioContext]);

  const playBassNote = useCallback(() => {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = 90 + (Math.random() > 0.5 ? 18 : 0);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }, [ensureAudioContext]);

  const handleToggleStep = (instrument: DrumType, stepIndex: number) => {
    setPattern((current) => ({
      ...current,
      [instrument]: current[instrument].map((value, index) =>
        index === stepIndex ? (value === 1 ? 0 : 1) : value,
      ),
    }));
  };

  const applyPreset = (name: PresetName) => {
    const selected = presets[name];
    setPresetName(name);
    setBpm(selected.bpm);
    setPattern(createPattern(selected.pattern));
    setActiveStep(0);
    activeStepRef.current = 0;
  };

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const openFullTrackExperience = (track: Track, index = -1) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
    setIsPlaying(true);
    setFullExperienceTrack(track);
    open?.({
      type: 'success',
      message: 'Đang mở trải nghiệm nhạc',
      description: 'Bạn đang nghe bản nhạc trong web của riêng mình.',
    });
  };

  const handlePlayPause = async () => {
    if (!currentTrack || !audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
      open?.({
        type: 'error',
        message: 'Không thể phát nhạc',
        description: 'Trình duyệt chặn phát tự động. Vui lòng bấm play lại.',
      });
    }
  };

  const handleNextTrack = () => {
    if (!activeTracks.length) {
      return;
    }

    const nextIndex =
      currentIndex + 1 < activeTracks.length ? currentIndex + 1 : 0;
    playTrack(activeTracks[nextIndex], nextIndex);
  };

  const handlePreviousTrack = () => {
    if (!activeTracks.length) {
      return;
    }

    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : activeTracks.length - 1;
    playTrack(activeTracks[previousIndex], previousIndex);
  };

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
          'http://localhost:8000/api/favorite-music',
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

      await query.refetch();
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    const loadChart = async () => {
      setIsLoading(true);
      try {
        const res = await getTrendingTracks();
        const nextTracks = Array.isArray(res?.data) ? res.data : [];
        setTracks(nextTracks);

        if (!currentTrack && nextTracks[0]) {
          setCurrentTrack(nextTracks[0]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadChart();
  }, [currentTrack]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const res = await searchTracks(searchTerm);
        const nextTracks = Array.isArray(res?.data) ? res.data : [];
        setSearchResults(nextTracks);
      } catch (error) {
        console.error(error);
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const audio = audioRef.current;
    const audioSource = currentTrack ? getTrackAudioSource(currentTrack) : null;

    if (!audio) {
      return;
    }

    if (!audioSource) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.src = audioSource;
    audio.volume = volume;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, volume]);

  useEffect(() => {
    if (!isBeatPlaying) {
      setActiveStep(0);
      activeStepRef.current = 0;
      return;
    }

    const tickDuration = Math.max(100, ((60 / bpm) * 1000) / 4);
    const timer = window.setInterval(() => {
      const nextStep = (activeStepRef.current + 1) % stepCount;
      activeStepRef.current = nextStep;
      setActiveStep(nextStep);

      if (pattern.kick[nextStep]) {
        playKick();
      }

      if (pattern.snare[nextStep]) {
        playSnare();
      }

      if (pattern.hat[nextStep]) {
        playHat();
      }

      if (nextStep % 4 === 0) {
        playBassNote();
      }
    }, tickDuration);

    return () => window.clearInterval(timer);
  }, [bpm, isBeatPlaying, pattern, playBassNote, playHat, playKick, playSnare]);

  return (
    <Box
      sx={{
        backgroundColor: '#170f23',
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
        pb: 24,
      }}
    >
      <Typography variant="h4" fontWeight={700} color="#fff" mb={3}>
        🎵 Music Studio
      </Typography>
      <Typography variant="body1" color="#c7b9dc" mb={3}>
        Tạo beat, bố trí pattern và phát nhạc ngay trong giao diện React của
        bạn.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #2f1c4c 0%, #6b38c6 100%)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm bài hát..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#c7b9dc', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: 3,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.15)',
              },
            }}
          />
          <Chip
            label="React Music Player"
            sx={{ bgcolor: '#ffffff22', color: '#fff' }}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: '#23153a',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="h5" color="#fff" fontWeight={700}>
              🎛️ Beat Maker
            </Typography>
            <Typography variant="body2" color="#c7b9dc">
              Chọn preset, chỉnh BPM và bật/tắt các bước beat để tạo nhạc của
              riêng bạn.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setIsBeatPlaying((value) => !value)}
            sx={{ bgcolor: '#9b4dff', '&:hover': { bgcolor: '#7a33d2' } }}
          >
            {isBeatPlaying ? 'Dừng beat' : 'Phát beat'}
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
          <Box>
            <Typography variant="body2" color="#c7b9dc" mb={1}>
              Preset
            </Typography>
            <Stack direction="row" spacing={1}>
              {(['lofi', 'trap', 'house'] as PresetName[]).map((name) => (
                <Button
                  key={name}
                  variant={presetName === name ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => applyPreset(name)}
                  sx={{
                    color: presetName === name ? '#fff' : '#c7b9dc',
                    borderColor: 'rgba(255,255,255,0.15)',
                    textTransform: 'none',
                  }}
                >
                  {name.toUpperCase()}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 220 }}>
            <Typography variant="body2" color="#c7b9dc" mb={1}>
              BPM: {bpm}
            </Typography>
            <Slider
              value={bpm}
              min={70}
              max={140}
              step={1}
              onChange={(_, value) => setBpm(value as number)}
              sx={{ color: '#9b4dff' }}
            />
          </Box>
        </Stack>

        <Typography variant="body2" color="#c7b9dc" mb={1}>
          Bước đang phát: {activeStep + 1}/16
        </Typography>

        <Stack spacing={1.5}>
          {(['kick', 'snare', 'hat'] as DrumType[]).map((instrument) => (
            <Box key={instrument}>
              <Typography
                variant="subtitle2"
                color="#fff"
                mb={1}
                textTransform="capitalize"
              >
                {instrument}
              </Typography>
              <Stack direction="row" spacing={1}>
                {pattern[instrument].map((isActive, index) => (
                  <Button
                    key={`${instrument}-${index}`}
                    variant={isActive ? 'contained' : 'outlined'}
                    onClick={() => handleToggleStep(instrument, index)}
                    sx={{
                      minWidth: 28,
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: 1,
                      bgcolor: isActive ? '#9b4dff' : 'rgba(255,255,255,0.06)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: isActive ? '#7a33d2' : 'rgba(255,255,255,0.1)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Box mb={3}>
            <Typography variant="h5" color="white" fontWeight={700} mb={2}>
              🔥 Top Trending
            </Typography>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress sx={{ color: '#9b4dff' }} />
              </Box>
            ) : (
              <Stack spacing={2}>
                {activeTracks.slice(0, 10).map((track, index) => {
                  const trackId = String(track.id);
                  const isLiked = favoriteSet.has(trackId);

                  return (
                    <Card
                      key={track.id ?? `${track.title}-${index}`}
                      onClick={() => playTrack(track, index)}
                      sx={{
                        bgcolor: '#2a213a',
                        color: '#fff',
                        cursor: 'pointer',
                        border:
                          currentTrack?.id === track.id
                            ? '1px solid #9b4dff'
                            : '1px solid transparent',
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
                              <Typography fontWeight={600}>
                                {track.title}
                              </Typography>
                              <Typography color="gray">
                                {typeof track.artist === 'string'
                                  ? track.artist
                                  : track.artist?.name}
                              </Typography>
                            </Box>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openFullTrackExperience(track, index);
                                }}
                                sx={{
                                  color: '#fff',
                                  borderColor: 'rgba(255,255,255,0.2)',
                                  textTransform: 'none',
                                }}
                              >
                                Nghe full
                              </Button>

                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void toggleFavorite(track);
                                }}
                              >
                                {isLiked ? (
                                  <FavoriteIcon sx={{ color: '#ff4081' }} />
                                ) : (
                                  <FavoriteBorderIcon
                                    sx={{ color: '#ff4081' }}
                                  />
                                )}
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={{ backgroundColor: '#170f23', p: 0 }}>
            <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
              Thể Loại Nhạc
            </Typography>

            <Grid container spacing={2}>
              {genres.map((genre) => (
                <Grid item xs={12} sm={6} key={genre.id}>
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
                    <CardMedia
                      component="img"
                      height="140"
                      image={genre.image}
                    />

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
        </Grid>
      </Grid>

      {fullExperienceTrack && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(5, 6, 12, 0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 860,
              bgcolor: '#17121f',
              borderRadius: 4,
              p: { xs: 2, md: 3 },
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography color="#fff" fontWeight={700} variant="h5">
                🎧 Trải nghiệm nhạc trong web
              </Typography>
              <IconButton
                onClick={() => setFullExperienceTrack(null)}
                sx={{ color: '#fff' }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems="center"
            >
              <Box
                sx={{
                  width: { xs: '100%', md: 280 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src={fullExperienceTrack.album?.cover_medium}
                  alt={fullExperienceTrack.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Typography color="#fff" variant="h5" fontWeight={700}>
                  {fullExperienceTrack.title}
                </Typography>
                <Typography color="#c7b9dc" mb={2}>
                  {typeof fullExperienceTrack.artist === 'string'
                    ? fullExperienceTrack.artist
                    : fullExperienceTrack.artist?.name}
                </Typography>
                <Typography color="#9b9bb6" variant="body2" mb={2}>
                  Web này đã được chuyển sang phát nhạc trực tiếp trong trang,
                  không mở tab YouTube nữa. Nếu API có đường dẫn full song, hệ
                  thống sẽ dùng ngay nguồn đó.
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <IconButton
                    onClick={handlePreviousTrack}
                    sx={{ color: '#fff' }}
                  >
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      color: '#fff',
                      bgcolor: '#9b4dff',
                      '&:hover': { bgcolor: '#7a33d2' },
                    }}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton onClick={handleNextTrack} sx={{ color: '#fff' }}>
                    <SkipNextIcon />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="#c7b9dc">
                    {formatTime(currentTime)}
                  </Typography>
                  <Slider
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={(_, value) => {
                      const nextTime = ((value as number) / 100) * duration;
                      if (audioRef.current) {
                        audioRef.current.currentTime = nextTime;
                      }
                      setCurrentTime(nextTime);
                    }}
                    sx={{ color: '#9b4dff', flexGrow: 1 }}
                  />
                  <Typography variant="caption" color="#c7b9dc">
                    {formatTime(duration)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}

      {currentTrack && !fullExperienceTrack && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 'calc(100% - 24px)', md: 520 },
            bgcolor: '#1e1e1e',
            borderRadius: 4,
            p: 2,
            zIndex: 9998,
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          <IconButton
            onClick={() => {
              setCurrentTrack(null);
              setCurrentIndex(-1);
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
            }}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                overflow: 'hidden',
                animation: isPlaying ? `${spin} 3s linear infinite` : 'none',
                flexShrink: 0,
              }}
            >
              <img
                src={currentTrack.album?.cover_medium}
                alt={currentTrack.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography color="white" fontWeight={700} noWrap>
                {currentTrack.title}
              </Typography>
              <Typography color="gray" variant="body2" noWrap>
                {typeof currentTrack.artist === 'string'
                  ? currentTrack.artist
                  : currentTrack.artist?.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <IconButton
                  onClick={handlePreviousTrack}
                  sx={{ color: '#fff' }}
                >
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton
                  onClick={handlePlayPause}
                  sx={{
                    color: '#fff',
                    bgcolor: '#9b4dff',
                    '&:hover': { bgcolor: '#7a33d2' },
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={handleNextTrack} sx={{ color: '#fff' }}>
                  <SkipNextIcon />
                </IconButton>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    openFullTrackExperience(currentTrack, currentIndex)
                  }
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)',
                    textTransform: 'none',
                    ml: 1,
                  }}
                >
                  Nghe full
                </Button>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mt={2}>
            <Typography variant="caption" color="#c7b9dc">
              {formatTime(currentTime)}
            </Typography>
            <Slider
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={(_, value) => {
                const nextTime = ((value as number) / 100) * duration;
                if (audioRef.current) {
                  audioRef.current.currentTime = nextTime;
                }
                setCurrentTime(nextTime);
              }}
              sx={{ color: '#9b4dff', flexGrow: 1 }}
            />
            <Typography variant="caption" color="#c7b9dc">
              {formatTime(duration)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <VolumeUpIcon sx={{ color: '#c7b9dc' }} />
            <Slider
              value={volume * 100}
              onChange={(_, value) => {
                const nextVolume = (value as number) / 100;
                setVolume(nextVolume);
                if (audioRef.current) {
                  audioRef.current.volume = nextVolume;
                }
              }}
              sx={{ color: '#9b4dff', width: 120 }}
            />
          </Stack>

          <audio
            ref={audioRef}
            src={getTrackAudioSource(currentTrack) ?? undefined}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(event) => {
              const target = event.currentTarget;
              setCurrentTime(target.currentTime);
              if (!duration) {
                setDuration(target.duration || 0);
              }
            }}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration || 0);
            }}
            onEnded={handleNextTrack}
            onError={() => setIsPlaying(false)}
          />
        </Box>
      )}
    </Box>
  );
};
