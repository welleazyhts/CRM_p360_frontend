import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
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
  Alert,
  CircularProgress
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
  const [downloading, setDownloading] = useState(null);

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

  // Generate PDF content based on template category
  const generatePDFContent = (doc, template) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Header
    doc.setFillColor(41, 98, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(template.name, margin, 28);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos = 60;

    // Category badge
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, yPos, 80, 20, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Category: ${template.category}`, margin + 5, yPos + 13);
    yPos += 35;

    // Description
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', margin, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const splitDescription = doc.splitTextToSize(template.description, pageWidth - 2 * margin);
    doc.text(splitDescription, margin, yPos);
    yPos += splitDescription.length * 7 + 15;

    // Form fields based on category
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Form Fields:', margin, yPos);
    yPos += 15;

    const formFields = getFormFieldsByCategory(template.category);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    formFields.forEach((field, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      // Field label
      doc.text(`${index + 1}. ${field.label}:`, margin, yPos);

      // Field input line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin + 100, yPos, pageWidth - margin, yPos);

      yPos += 20;
    });

    // Footer
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${currentDate}`, margin, pageHeight - 15);
    doc.text(`Template ID: ${template.id}`, pageWidth - margin - 50, pageHeight - 15);

    // Add signature section
    if (yPos < pageHeight - 80) {
      yPos = Math.max(yPos + 30, pageHeight - 80);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text('Signature: ___________________', margin, yPos);
      doc.text('Date: ___________________', pageWidth / 2, yPos);
    }
  };

  // Get form fields based on template category
  const getFormFieldsByCategory = (category) => {
    switch (category) {
      case 'Proposal':
        return [
          { label: 'Full Name' },
          { label: 'Date of Birth' },
          { label: 'Address' },
          { label: 'Phone Number' },
          { label: 'Email Address' },
          { label: 'Policy Type' },
          { label: 'Coverage Amount' },
          { label: 'Premium Preference' },
          { label: 'Nominee Name' },
          { label: 'Nominee Relationship' }
        ];
      case 'KYC':
        return [
          { label: 'Full Legal Name' },
          { label: 'Date of Birth' },
          { label: 'PAN Number' },
          { label: 'Aadhaar Number' },
          { label: 'Current Address' },
          { label: 'Permanent Address' },
          { label: 'Occupation' },
          { label: 'Annual Income' },
          { label: 'ID Proof Type' },
          { label: 'ID Proof Number' }
        ];
      case 'Claims':
        return [
          { label: 'Policy Number' },
          { label: 'Policyholder Name' },
          { label: 'Claim Type' },
          { label: 'Date of Incident' },
          { label: 'Description of Incident' },
          { label: 'Claim Amount' },
          { label: 'Hospital/Garage Name' },
          { label: 'Doctor/Mechanic Name' },
          { label: 'Bank Account Number' },
          { label: 'IFSC Code' }
        ];
      case 'Renewal':
        return [
          { label: 'Existing Policy Number' },
          { label: 'Policyholder Name' },
          { label: 'Current Premium' },
          { label: 'New Coverage Needed' },
          { label: 'Address Changes (if any)' },
          { label: 'Contact Number' },
          { label: 'Email Address' },
          { label: 'Payment Mode' },
          { label: 'Auto-Renewal Preference' }
        ];
      default:
        return [
          { label: 'Name' },
          { label: 'Date' },
          { label: 'Address' },
          { label: 'Phone' },
          { label: 'Email' }
        ];
    }
  };

  const handleDownload = async (template) => {
    try {
      setDownloading(template.id);

      // Update download count in the service
      await templateService.downloadTemplate(template.id);

      // Generate PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Generate PDF content based on template
      generatePDFContent(doc, template);

      // Generate filename
      const filename = template.name.toLowerCase().replace(/\s+/g, '-') + '.pdf';

      // Download the PDF
      doc.save(filename);

      setSnackbar({
        open: true,
        message: `Successfully downloaded ${template.name}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download template',
        severity: 'error'
      });
    } finally {
      setDownloading(null);
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
                  startIcon={downloading === template.id ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={() => handleDownload(template)}
                  disabled={downloading === template.id}
                >
                  {downloading === template.id ? 'Generating PDF...' : `Download PDF`}
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