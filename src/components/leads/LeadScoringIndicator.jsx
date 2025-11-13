import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const LeadScoringIndicator = ({ score = 0, stage = 'Prospect', showDetails = true, scoreBreakdown = null }) => {
  const theme = useTheme();

  // Calculate score metrics
  const getScoreLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'success', icon: TrophyIcon };
    if (score >= 60) return { level: 'Good', color: 'info', icon: StarIcon };
    if (score >= 40) return { level: 'Fair', color: 'warning', icon: SpeedIcon };
    return { level: 'Poor', color: 'error', icon: TrendingDownIcon };
  };

  const scoreData = getScoreLevel(score);
  const ScoreIcon = scoreData.icon;

  // Use actual scoring factors from breakdown, or defaults
  const scoringFactors = scoreBreakdown ? [
    { name: 'Engagement', value: scoreBreakdown.engagement || 50, weight: '30%' },
    { name: 'Budget Fit', value: scoreBreakdown.budget || 50, weight: '25%' },
    { name: 'Timeline', value: scoreBreakdown.timeline || 50, weight: '20%' },
    { name: 'Authority', value: scoreBreakdown.authority || 50, weight: '15%' },
    { name: 'Need', value: scoreBreakdown.need || 50, weight: '10%' },
  ] : [
    { name: 'Engagement', value: 50, weight: '30%' },
    { name: 'Budget Fit', value: 50, weight: '25%' },
    { name: 'Timeline', value: 50, weight: '20%' },
    { name: 'Authority', value: 50, weight: '15%' },
    { name: 'Need', value: 50, weight: '10%' },
  ];

  const CompactView = () => (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="caption" fontWeight="600">
            Lead Score: {score}/100
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Level: {scoreData.level}
          </Typography>
        </Box>
      }
      arrow
    >
      <Chip
        icon={<ScoreIcon />}
        label={`${score}`}
        color={scoreData.color}
        size="small"
        sx={{
          fontWeight: 700,
          '& .MuiChip-icon': {
            fontSize: 16,
          },
        }}
      />
    </Tooltip>
  );

  const DetailedView = () => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette[scoreData.color].main, 0.15)}`,
        border: `2px solid ${alpha(theme.palette[scoreData.color].main, 0.2)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[scoreData.color].main, 0.15),
                color: `${scoreData.color}.main`,
                width: 56,
                height: 56,
              }}
            >
              <ScoreIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="700" color={`${scoreData.color}.main`}>
                {score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                out of 100
              </Typography>
            </Box>
          </Box>
          <Chip
            label={scoreData.level}
            color={scoreData.color}
            sx={{
              fontWeight: 700,
              fontSize: '0.875rem',
              height: 32,
            }}
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">
              Score Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {score}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={score}
            color={scoreData.color}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette[scoreData.color].main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Stage Info */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            Current Stage
          </Typography>
          <Typography variant="body1" fontWeight="600">
            {stage}
          </Typography>
        </Box>

        {/* Scoring Factors */}
        <Typography variant="body2" fontWeight="600" gutterBottom>
          Scoring Breakdown
        </Typography>
        <Stack spacing={1.5}>
          {scoringFactors.map((factor, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {factor.name} ({factor.weight})
                </Typography>
                <Typography variant="caption" fontWeight="600">
                  {factor.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={factor.value}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }}
              />
            </Box>
          ))}
        </Stack>

        {/* Improvement Tip */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 2,
            borderLeft: `3px solid ${theme.palette.warning.main}`,
          }}
        >
          <Typography variant="caption" fontWeight="600" color="warning.main" display="block">
            💡 Improvement Tip
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {score < 60
              ? 'Increase engagement by scheduling a follow-up call and sharing product information.'
              : score < 80
              ? 'Validate budget and timeline to move to next stage.'
              : 'Great score! Focus on closing the deal soon.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return showDetails ? <DetailedView /> : <CompactView />;
};

export default LeadScoringIndicator;
