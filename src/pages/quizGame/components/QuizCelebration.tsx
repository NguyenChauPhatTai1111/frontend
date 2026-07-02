import { Box, Typography } from '@mui/material';

interface QuizCelebrationProps {
  percentage: number;
}

export default function QuizCelebration({ percentage }: QuizCelebrationProps) {
  const badge =
    percentage >= 80
      ? 'Xuất sắc'
      : percentage >= 60
        ? 'Rất tốt'
        : 'Cố gắng thêm';

  const stars = Math.min(5, Math.max(1, Math.ceil(percentage / 20)));

  return (
    <Box sx={{ position: 'relative', py: 2, mb: 3 }}>
      <Box
        sx={{
          position: 'relative',
          height: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: 8,
              height: 24,
              borderRadius: 999,
              bgcolor: ['#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'][index % 4],
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-34px)`,
              animation: `celebrateFloat 1.2s ease-in-out infinite`,
              animationDelay: `${index * 0.08}s`,
              '@keyframes celebrateFloat': {
                '0%, 100%': {
                  transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-34px) scale(1)`,
                },
                '50%': {
                  transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-44px) scale(1.08)`,
                },
              },
            }}
          />
        ))}

        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 24,
            boxShadow: '0 12px 40px rgba(25, 118, 210, 0.3)',
          }}
        >
          ✨
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              fontSize: 20,
              opacity: index < stars ? 1 : 0.28,
              animation: 'starPulse 1s ease-in-out infinite',
              animationDelay: `${index * 0.08}s`,
              '@keyframes starPulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
              },
            }}
          >
            ⭐
          </Box>
        ))}
      </Box>

      <Typography variant="h6" fontWeight={700} color="primary.main">
        {badge}
      </Typography>
    </Box>
  );
}
