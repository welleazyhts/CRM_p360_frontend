import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const AutoQuoteSettings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    enabled: true,
    frequency: 'Weekly',
    autoSendTime: '09:00',
    includeWeekends: false
  });

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    // Mock API call would go here
    console.log(`Updated ${field} to:`, value);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScheduleIcon color="primary" />
        Auto-Quote Sharing
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Configure automated quote sharing to send personalized quotes to customers at defined intervals.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Basic Configuration
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enabled}
                      onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        Enable Auto-Quote Sharing
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Automatically send quotes to customers
                      </Typography>
                    </Box>
                  }
                />

                <FormControl fullWidth disabled={!settings.enabled}>
                  <InputLabel>Sharing Frequency</InputLabel>
                  <Select
                    value={settings.frequency}
                    label="Sharing Frequency"
                    onChange={(e) => handleSettingsChange('frequency', e.target.value)}
                  >
                    <MenuItem value="Daily">📅 Daily</MenuItem>
                    <MenuItem value="Weekly">📆 Weekly</MenuItem>
                    <MenuItem value="Monthly">🗓️ Monthly</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeWeekends}
                      onChange={(e) => handleSettingsChange('includeWeekends', e.target.checked)}
                      disabled={!settings.enabled}
                    />
                  }
                  label="Include Weekends"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})` }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  href="/settings/auto-quotes"
                  fullWidth
                >
                  Advanced Settings
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SendIcon />}
                  disabled={!settings.enabled}
                  fullWidth
                >
                  Send Test Quote
                </Button>
                
                <Divider />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon fontSize="small" color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    Current Status: {settings.enabled ? 'Active' : 'Disabled'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutoQuoteSettings;