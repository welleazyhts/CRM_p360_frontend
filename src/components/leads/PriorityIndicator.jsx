import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Avatar,
  Badge,
  useTheme,
  alpha,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocalFireDepartment as HotIcon,
  WbSunny as WarmIcon,
  AcUnit as ColdIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const PriorityIndicator = ({ priority = 'Warm', compact = false, showStats = false, leadData = {} }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // Priority configuration
  const priorityConfig = {
    Hot: {
      label: 'Hot Lead',
      icon: HotIcon,
      color: '#FF4444',
      bgColor: alpha('#FF4444', 0.1),
      description: 'High conversion probability - Contact within 24 hours',
      emoji: '🔥',
      urgency: 'Critical',
      expectedConversion: '60-80%',
      actionTime: '< 24 hours',
    },
    Warm: {
      label: 'Warm Lead',
      icon: WarmIcon,
      color: '#FF9800',
      bgColor: alpha('#FF9800', 0.1),
      description: 'Moderate interest - Follow up within 2-3 days',
      emoji: '☀️',
      urgency: 'High',
      expectedConversion: '30-50%',
      actionTime: '2-3 days',
    },
    Cold: {
      label: 'Cold Lead',
      icon: ColdIcon,
      color: '#2196F3',
      bgColor: alpha('#2196F3', 0.1),
      description: 'Low engagement - Long-term nurturing needed',
      emoji: '❄️',
      urgency: 'Medium',
      expectedConversion: '10-20%',
      actionTime: '1 week',
    },
  };

  const config = priorityConfig[priority] || priorityConfig.Warm;
  const PriorityIcon = config.icon;

  // Compact Badge View
  const CompactView = () => (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="caption" fontWeight="600" display="block">
            {config.emoji} {config.label}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            {config.description}
          </Typography>
        </Box>
      }
      arrow
    >
      <Chip
        icon={<PriorityIcon />}
        label={t(`leads.priorities.${priority}`, priority)}
        sx={{
          bgcolor: config.bgColor,
          color: config.color,
          fontWeight: 700,
          border: `2px solid ${config.color}`,
          '& .MuiChip-icon': {
            color: config.color,
          },
          animation: priority === 'Hot' ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 },
          },
        }}
      />
    </Tooltip>
  );

  // Full Card View
  const CardView = () => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: `0 8px 24px ${alpha(config.color, 0.15)}`,
        border: `2px solid ${config.color}`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Animated Corner Badge */}
      {priority === 'Hot' && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            bgcolor: config.color,
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'bounce 1s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-5px)' },
            },
          }}
        >
          <StarIcon fontSize="small" />
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: config.bgColor,
              color: config.color,
              width: 64,
              height: 64,
              border: `3px solid ${config.color}`,
            }}
          >
            <PriorityIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="700" sx={{ color: config.color }}>
              {config.emoji} {config.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>
        </Box>

        {/* Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(config.color, 0.05),
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" fontWeight="700" sx={{ color: config.color }}>
                {config.expectedConversion}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Conversion Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" fontWeight="700" color="warning.main">
                {config.urgency}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Urgency Level
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" fontWeight="700" color="info.main">
                {config.actionTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Response Time
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Items */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(config.color, 0.05),
            borderRadius: 2,
            borderLeft: `4px solid ${config.color}`,
          }}
        >
          <Typography variant="caption" fontWeight="700" sx={{ color: config.color }} display="block" gutterBottom>
            ⚡ Recommended Actions:
          </Typography>
          <Stack spacing={0.5}>
            {priority === 'Hot' && (
              <>
                <Typography variant="caption" color="text.secondary">
                  • Call immediately - Don't lose momentum
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Send personalized quote within 2 hours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Schedule demo/meeting ASAP
                </Typography>
              </>
            )}
            {priority === 'Warm' && (
              <>
                <Typography variant="caption" color="text.secondary">
                  • Follow up within 48 hours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Share relevant case studies
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Add to nurture campaign
                </Typography>
              </>
            )}
            {priority === 'Cold' && (
              <>
                <Typography variant="caption" color="text.secondary">
                  • Add to long-term nurture sequence
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Send educational content monthly
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Re-qualify in 30 days
                </Typography>
              </>
            )}
          </Stack>
        </Box>

        {/* Lead Info if available */}
        {leadData.name && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Lead Information:
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {leadData.name}
              </Typography>
              {leadData.lastContact && (
                <Typography variant="caption" color="text.secondary">
                  Last Contact: {leadData.lastContact}
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  // Stats Dashboard View
  const StatsView = () => (
    <Grid container spacing={3}>
      {Object.entries(priorityConfig).map(([key, config]) => {
        const Icon = config.icon;
        const count = leadData[`${key.toLowerCase()}Count`] || 0;

        return (
          <Grid item xs={12} md={4} key={key}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: `0 4px 12px ${alpha(config.color, 0.1)}`,
                border: `2px solid ${alpha(config.color, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${alpha(config.color, 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: config.bgColor,
                      color: config.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Icon />
                  </Avatar>
                  <Chip
                    label={key}
                    sx={{
                      bgcolor: config.bgColor,
                      color: config.color,
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight="700" sx={{ color: config.color }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.label}s
                </Typography>
                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(config.color, 0.2)}` }}>
                  <Typography variant="caption" color="text.secondary">
                    Conversion: {config.expectedConversion}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  if (showStats) return <StatsView />;
  if (compact) return <CompactView />;
  return <CardView />;
};

export default PriorityIndicator;
