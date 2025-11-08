import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { supportedLanguages } from '../../i18n';

const LanguageTest = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
  };

  const currentLang = getCurrentLanguageInfo();

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('settings.language')} {t('common.test', 'Test')}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current Language: {currentLang.nativeName} ({currentLang.code})
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('settings.selectLanguage')}
          </Typography>
          <Grid container spacing={1}>
            {supportedLanguages.map((lang) => (
              <Grid item key={lang.code}>
                <Chip
                  label={`${lang.flag} ${lang.nativeName}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  color={i18n.language === lang.code ? 'primary' : 'default'}
                  variant={i18n.language === lang.code ? 'filled' : 'outlined'}
                  sx={{ mb: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            {t('common.test', 'Translation Test')}:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{t('settings.title')}:</strong> {t('settings.title')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('settings.notifications')}:</strong> {t('settings.notifications')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('navigation.dashboard')}:</strong> {t('navigation.dashboard')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('navigation.campaigns')}:</strong> {t('navigation.campaigns')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>{t('common.save')}:</strong> {t('common.save')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('common.cancel')}:</strong> {t('common.cancel')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('common.loading')}:</strong> {t('common.loading')}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>{t('whatsapp.templateManager')}:</strong> {t('whatsapp.templateManager')}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" size="small">
            {t('common.save')}
          </Button>
          <Button variant="outlined" size="small">
            {t('common.cancel')}
          </Button>
          <Button variant="text" size="small">
            {t('common.close')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LanguageTest; 