import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Collapse,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useDedupe } from '../../context/DedupeContext';

const BulkUpload = ({
  open,
  onClose,
  title = 'Bulk Upload',
  source = 'unknown',
  existingData = [],
  requiredFields = [],
  fieldMapping = {},
  onUploadComplete,
  allowOverride = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { batchCheckDuplicates, addUploadRecord } = useDedupe();

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState([]);
  const [validRecords, setValidRecords] = useState([]);
  const [failedRecords, setFailedRecords] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [showValidDetails, setShowValidDetails] = useState(true);
  const [showFailedDetails, setShowFailedDetails] = useState(true);

  const steps = [
    t('upload.steps.upload'),
    t('upload.steps.review'),
    t('upload.steps.confirm')
  ];

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  // Parse CSV/Excel file
  const parseFile = (file) => {
    setParsing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        console.log('📚 Workbook Info:', {
          sheetNames: workbook.SheetNames,
          numberOfSheets: workbook.SheetNames.length
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log('📄 First Sheet Name:', workbook.SheetNames[0]);
        console.log('📄 Sheet Range:', firstSheet['!ref']);
        console.log('📄 Raw Sheet Data:', firstSheet);

        // Try to get JSON data
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        console.log('📄 Parsed JSON Data:', jsonData);
        console.log('📄 Number of rows parsed:', jsonData.length);

        // If no data, try with header option
        if (jsonData.length === 0) {
          console.warn('⚠️ No data found with default parsing, trying alternative methods...');

          // Try getting raw data including headers
          const rawData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          console.log('📄 Raw data (with header: 1):', rawData);

          // Try without header
          const dataWithoutHeader = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
          console.log('📄 Data without header:', dataWithoutHeader);

          if (rawData.length === 0) {
            alert(t('upload.errors.emptyFile'));
            setParsing(false);
            return;
          }
        }

        console.log('🗺️ Field Mapping:', fieldMapping);

        // Map fields if mapping provided
        const mappedData = jsonData.map((row, index) => {
          if (Object.keys(fieldMapping).length > 0) {
            const mappedRow = {};
            // fieldMapping has keys as display names (e.g., "Name") and values as internal names (e.g., "name")
            Object.keys(fieldMapping).forEach(displayName => {
              const internalName = fieldMapping[displayName];

              // Try exact match first
              if (row.hasOwnProperty(displayName)) {
                mappedRow[internalName] = row[displayName];
              }
              // Try case-insensitive match
              else {
                const rowKeys = Object.keys(row);
                const matchingKey = rowKeys.find(key =>
                  key.toLowerCase().trim() === displayName.toLowerCase().trim()
                );
                if (matchingKey) {
                  mappedRow[internalName] = row[matchingKey];
                } else if (row.hasOwnProperty(internalName)) {
                  // Fallback: if the file already uses internal names
                  mappedRow[internalName] = row[internalName];
                }
              }
            });

            console.log(`Row ${index + 1} mapped:`, mappedRow);
            return mappedRow;
          }
          return row;
        });

        console.log('✅ Mapped Data:', mappedData);
        console.log('✅ Number of mapped records:', mappedData.length);

        setParsedData(mappedData);
        validateData(mappedData);
        setActiveStep(1);
      } catch (error) {
        console.error('❌ Parse Error:', error);
        alert(t('upload.errors.parseError'));
      } finally {
        setParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Validate data
  const validateData = (data) => {
    console.log('🔍 Starting validation for', data.length, 'records');
    console.log('📋 Required fields:', requiredFields);

    const valid = [];
    const failed = [];

    data.forEach((row, index) => {
      const errors = [];

      // Check if row is completely empty
      const hasAnyData = Object.values(row).some(value =>
        value !== null && value !== undefined && value.toString().trim() !== ''
      );

      if (!hasAnyData) {
        errors.push('Empty row - no data found');
      } else {
        // Check required fields
        requiredFields.forEach(field => {
          if (!row[field] || row[field].toString().trim() === '') {
            errors.push(`Missing required field: ${field}`);
          }
        });
      }

      if (errors.length > 0) {
        console.log(`❌ Row ${index + 1} failed:`, errors, row);
        failed.push({
          rowNumber: index + 1,
          record: row,
          reason: errors.join('; '),
          type: 'validation'
        });
      } else {
        console.log(`✅ Row ${index + 1} valid:`, row);
        valid.push({
          rowNumber: index + 1,
          record: row
        });
      }
    });

    console.log('📊 Validation Summary:', {
      total: data.length,
      valid: valid.length,
      failed: failed.length
    });

    // Check for duplicates
    if (valid.length > 0) {
      const validData = valid.map(v => v.record);
      console.log('🔄 Checking for duplicates...');
      const dedupeResult = batchCheckDuplicates(validData, existingData, source);

      console.log('🔄 Dedupe Result:', {
        valid: dedupeResult.valid.length,
        duplicates: dedupeResult.duplicates.length
      });

      setValidRecords(dedupeResult.valid);
      setFailedRecords([
        ...failed,
        ...dedupeResult.duplicates.map(dup => ({
          ...dup,
          type: 'duplicate'
        }))
      ]);
    } else {
      console.log('⚠️ No valid records found, only failed records');
      setValidRecords([]);
      setFailedRecords(failed);
    }

    console.log('✨ Final state set:', {
      validRecords: valid.length > 0 ? 'from dedupe' : 0,
      failedRecords: failed.length
    });
  };

  // Handle upload
  const handleUpload = async () => {
    try {
      setActiveStep(2);
      setUploadProgress(0);

      const recordsToUpload = validRecords.map(v => v.record);
      const totalRecords = recordsToUpload.length;

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Record upload history
      addUploadRecord({
        source,
        filename: file.name,
        totalRecords: parsedData.length,
        validRecords: validRecords.length,
        failedRecords: failedRecords.length,
        uploadedBy: t('common.currentUser'), // Using a localized placeholder
        status: 'completed',
        failedRecords: failedRecords
      });

      // Wait for progress to complete
      await new Promise(resolve => {
        const checkProgress = setInterval(() => {
          if (uploadProgress >= 100) {
            clearInterval(checkProgress);
            resolve();
          }
        }, 100);
      });

      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(validRecords, failedRecords);
      }

      // Show success and close
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      alert(t('upload.errors.uploadFailed', { error: error.message }));
    }
  };

  // Download template
  const downloadTemplate = () => {
    // Use fieldMapping keys if available, otherwise fall back to requiredFields
    let headers;
    if (Object.keys(fieldMapping).length > 0) {
      headers = Object.keys(fieldMapping);
    } else if (requiredFields.length > 0) {
      headers = requiredFields;
    } else {
      headers = ['name', 'email', 'phone'];
    }

    const template = [headers];
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${source}_upload_template.xlsx`);
  };

  // Download failed records
  const downloadFailedRecords = () => {
    if (failedRecords.length === 0) return;

    const data = failedRecords.map(item => ({
      'Row Number': item.rowNumber,
      'Reason': item.reason,
      ...item.record
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Failed Records');
    XLSX.writeFile(wb, `${source}_failed_records_${Date.now()}.xlsx`);
  };

  // Handle close
  const handleClose = () => {
    setActiveStep(0);
    setFile(null);
    setParsedData([]);
    setValidRecords([]);
    setFailedRecords([]);
    setUploadProgress(0);
    setTabValue(0);
    onClose();
  };

  // Get first N fields for preview
  const getPreviewFields = (record) => {
    if (!record || typeof record !== 'object') return [];

    // If we have fieldMapping, use those internal field names in order
    if (Object.keys(fieldMapping).length > 0) {
      return Object.values(fieldMapping);
    }

    // Otherwise return all fields from the record
    const fields = Object.keys(record);
    return fields;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UploadIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            {t('upload.title', { source: t(`leads.${source}`) || source })}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 0: Upload File */}
        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <FileIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('upload.uploadCsvExcel')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('upload.selectFileContent', { source: t(`leads.${source}`) || source })}
            </Typography>

            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              size="large"
              disabled={parsing}
            >
              {t('upload.chooseFile')}
              <input
                type="file"
                hidden
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
              />
            </Button>

            {parsing && <LinearProgress sx={{ mt: 3 }} />}

            {file && (
              <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
                <strong>{t('upload.selectedFile', { name: '' })}</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Alert>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
              >
                {t('upload.downloadTemplate')}
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1: Review & Validate */}
        {activeStep === 1 && (
          <Box>
            {/* Summary Cards */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Paper
                sx={{
                  flex: 1,
                  p: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('upload.summary.total')}
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  {parsedData.length}
                </Typography>
              </Paper>

              <Paper
                sx={{
                  flex: 1,
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('upload.summary.valid')}
                </Typography>
                <Typography variant="h4" fontWeight="600" color="success.main">
                  {validRecords.length}
                </Typography>
              </Paper>

              <Paper
                sx={{
                  flex: 1,
                  p: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {t('upload.summary.failed')}
                </Typography>
                <Typography variant="h4" fontWeight="600" color="error.main">
                  {failedRecords.length}
                </Typography>
              </Paper>
            </Box>

            {/* Warning if no records found */}
            {parsedData.length === 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <strong>{t('upload.noRecordsFound')}</strong>
                <br />
                {t('upload.ensureData')}
                <br />
                {t('upload.checkConsole')}
              </Alert>
            )}

            {/* Tabs - Only show if we have parsed data */}
            {parsedData.length > 0 && (
              <>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                  <Tab
                    label={t('upload.validTab', { count: validRecords.length })}
                    icon={<CheckCircleIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label={t('upload.failedTab', { count: failedRecords.length })}
                    icon={<ErrorIcon />}
                    iconPosition="start"
                  />
                </Tabs>

                {/* Valid Records Tab */}
                {tabValue === 0 && (
                  <Box>
                    {validRecords.length > 0 ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="subtitle2">
                            {t('upload.validContent')}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => setShowValidDetails(!showValidDetails)}
                            endIcon={showValidDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          >
                            {showValidDetails ? t('common.hide') : t('common.show')} {t('common.details')}
                          </Button>
                        </Box>

                        <Collapse in={showValidDetails}>
                          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>{t('upload.rowNumber')}</TableCell>
                                  {validRecords.length > 0 &&
                                    getPreviewFields(validRecords[0].record).map((field) => (
                                      <TableCell key={field}>{field}</TableCell>
                                    ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {validRecords.map((item) => (
                                  <TableRow key={item.rowNumber}>
                                    <TableCell>{item.rowNumber}</TableCell>
                                    {getPreviewFields(item.record).map((field) => (
                                      <TableCell key={field}>
                                        {item.record[field]?.toString().slice(0, 50) || '-'}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </>
                    ) : (
                      <Alert severity="warning">{t('upload.noValidRecords')}</Alert>
                    )}
                  </Box>
                )}

                {/* Failed Records Tab */}
                {tabValue === 1 && (
                  <Box>
                    {failedRecords.length > 0 ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="subtitle2">
                            {t('upload.failedContent')}
                          </Typography>
                          <Box>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={downloadFailedRecords}
                              sx={{ mr: 1 }}
                            >
                              {t('common.export')}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setShowFailedDetails(!showFailedDetails)}
                              endIcon={showFailedDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            >
                              {showFailedDetails ? t('common.hide') : t('common.show')} {t('common.details')}
                            </Button>
                          </Box>
                        </Box>

                        <Collapse in={showFailedDetails}>
                          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                              <TableHead>
                                <TableRow>
                                  <TableCell>{t('upload.rowNumber')}</TableCell>
                                  <TableCell>{t('upload.type')}</TableCell>
                                  <TableCell>{t('upload.reason')}</TableCell>
                                  {failedRecords.length > 0 &&
                                    getPreviewFields(failedRecords[0].record).map((field) => (
                                      <TableCell key={field}>{field}</TableCell>
                                    ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {failedRecords.map((item) => (
                                  <TableRow key={item.rowNumber}>
                                    <TableCell>{item.rowNumber}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={t(`upload.types.${item.type}`) || item.type}
                                        size="small"
                                        color={item.type === 'duplicate' ? 'warning' : 'error'}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title={item.reason}>
                                        <Typography variant="caption" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                          {item.reason}
                                        </Typography>
                                      </Tooltip>
                                    </TableCell>
                                    {getPreviewFields(item.record).map((field) => (
                                      <TableCell key={field}>
                                        {item.record[field]?.toString().slice(0, 50) || '-'}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Collapse>
                      </>
                    ) : (
                      <Alert severity="success">{t('upload.allRecordsValid')}</Alert>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {/* Step 2: Confirm Upload */}
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ mb: 3 }}>
              {uploadProgress < 100 ? (
                <>
                  <UploadIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('upload.uploading')}
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {uploadProgress}% {t('common.loading')}
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircleIcon sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('upload.complete')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('upload.successMessage', { count: validRecords.length })}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && (
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
        )}

        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>{t('common.back')}</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={validRecords.length === 0}
              startIcon={<UploadIcon />}
            >
              {t('leads.bulk.upload')} {validRecords.length}
            </Button>
          </>
        )}

        {activeStep === 2 && uploadProgress === 100 && (
          <Button variant="contained" onClick={handleClose}>
            {t('common.done')}
          </Button>
        )}
      </DialogActions>
    </Dialog >
  );
};

export default BulkUpload;
