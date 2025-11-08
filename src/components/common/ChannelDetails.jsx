import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  alpha,
  useTheme,
  Grow
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationCity as LocationCityIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const ChannelDetails = ({ caseData, loaded = true, timeout = 500 }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Grow in={loaded} timeout={timeout}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">Channel Details</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <BusinessIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Business Channel
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {caseData?.channelDetails?.businessChannel || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <LocationCityIcon sx={{ mr: 2, color: theme.palette.info.main }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Region
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {caseData?.channelDetails?.region || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                    <SupervisorAccountIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Sales Manager
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {caseData?.channelDetails?.salesManager || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                    <BadgeIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Agent Name
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {caseData?.channelDetails?.agentName || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      {caseData?.channelDetails?.agentStatus === 'Active' ? (
                        <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                      ) : (
                        <CancelIcon sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                      )}
                      <Chip
                        label={caseData?.channelDetails?.agentStatus || 'Unknown'}
                        color={caseData?.channelDetails?.agentStatus === 'Active' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>
    </Grid>
  );
};

export default ChannelDetails; 