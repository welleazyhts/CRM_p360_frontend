import React, { useState, useEffect } from 'react';
import templateService from '../services/templateService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  useTheme,
  alpha,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as FormIcon,
  Assignment as ProposalIcon,
  AccountBox as KYCIcon,
  Receipt as ClaimIcon,
  Autorenew as RenewalIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

const TemplateDownloads = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load templates from API on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      setSnackbar({ open: true, message: 'Failed to load templates', severity: 'error' });
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Proposal': return <ProposalIcon />;
      case 'KYC': return <KYCIcon />;
      case 'Claims': return <ClaimIcon />;
      case 'Renewal': return <RenewalIcon />;
      default: return <FormIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Proposal': return theme.palette.primary.main;
      case 'KYC': return theme.palette.warning.main;
      case 'Claims': return theme.palette.error.main;
      case 'Renewal': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getFormatColor = (format) => {
    switch (format) {
      case 'PDF': return theme.palette.error.main;
      case 'DOCX': return theme.palette.info.main;
      case 'XLSX': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleDownload = async (template) => {
    try {
      await templateService.downloadTemplate(template.id);
      setSnackbar({
        open: true,
        message: `Downloading ${template.name}...`,
        severity: 'success'
      });

      // In real implementation, this would trigger actual file download
      // window.open(template.url, '_blank');
    } catch (error) {
      console.error('Error downloading template:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download template',
        severity: 'error'
      });
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesFormat = formatFilter === 'all' || template.format === formatFilter;
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const stats = {
    total: templates.length,
    totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
    categories: [...new Set(templates.map(t => t.category))].length,
    formats: [...new Set(templates.map(t => t.format))].length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Template Downloads
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Download standardized forms and templates for insurance processes
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Templates
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {stats.total}
                  </Typography>
                </Box>
                <FormIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Downloads
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {stats.totalDownloads.toLocaleString()}
                  </Typography>
                </Box>
                <GetAppIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="info.main">
                    {stats.categories}
                  </Typography>
                </Box>
                <FilterIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    File Formats
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="warning.main">
                    {stats.formats}
                  </Typography>
                </Box>
                <FormIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="Proposal">Proposal Forms</MenuItem>
                  <MenuItem value="KYC">KYC Forms</MenuItem>
                  <MenuItem value="Claims">Claim Forms</MenuItem>
                  <MenuItem value="Renewal">Renewal Forms</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={formatFilter}
                  label="Format"
                  onChange={(e) => setFormatFilter(e.target.value)}
                >
                  <MenuItem value="all">All Formats</MenuItem>
                  <MenuItem value="PDF">PDF</MenuItem>
                  <MenuItem value="DOCX">DOCX</MenuItem>
                  <MenuItem value="XLSX">XLSX</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setFormatFilter('all');
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(getCategoryColor(template.category), 0.1),
                      color: getCategoryColor(template.category)
                    }}
                  >
                    {getCategoryIcon(template.category)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {template.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={template.category}
                        size="small"
                        sx={{
                          bgcolor: alpha(getCategoryColor(template.category), 0.1),
                          color: getCategoryColor(template.category)
                        }}
                      />
                      <Chip
                        label={template.format}
                        size="small"
                        sx={{
                          bgcolor: alpha(getFormatColor(template.format), 0.1),
                          color: getFormatColor(template.format)
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Size: {template.size}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Downloads: {template.downloads.toLocaleString()}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(template)}
                >
                  Download {template.format}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <FormIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateDownloads;