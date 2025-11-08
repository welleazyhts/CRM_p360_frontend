import React, { useState } from 'react';
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
  const [showValidDetails, setShowValidDetails] = useState(false);
  const [showFailedDetails, setShowFailedDetails] = useState(true);

  const steps = ['Upload File', 'Review & Validate', 'Confirm Upload'];

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
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Map fields if mapping provided
        const mappedData = jsonData.map(row => {
          if (Object.keys(fieldMapping).length > 0) {
            const mappedRow = {};
            Object.keys(fieldMapping).forEach(key => {
              mappedRow[key] = row[fieldMapping[key]] || row[key];
            });
            return mappedRow;
          }
          return row;
        });

        setParsedData(mappedData);
        validateData(mappedData);
        setActiveStep(1);
      } catch (error) {
        alert('Failed to parse file: ' + error.message);
      } finally {
        setParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Validate data
  const validateData = (data) => {
    const valid = [];
    const failed = [];

    data.forEach((row, index) => {
      const errors = [];

      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Missing required field: ${field}`);
        }
      });

      if (errors.length > 0) {
        failed.push({
          rowNumber: index + 1,
          record: row,
          reason: errors.join('; '),
          type: 'validation'
        });
      } else {
        valid.push({
          rowNumber: index + 1,
          record: row
        });
      }
    });

    // Check for duplicates
    if (valid.length > 0) {
      const validData = valid.map(v => v.record);
      const dedupeResult = batchCheckDuplicates(validData, existingData, source);

      setValidRecords(dedupeResult.valid);
      setFailedRecords([
        ...failed,
        ...dedupeResult.duplicates.map(dup => ({
          ...dup,
          type: 'duplicate'
        }))
      ]);
    } else {
      setValidRecords([]);
      setFailedRecords(failed);
    }
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
        uploadedBy: 'Current User', // Should be replaced with actual user
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
        onUploadComplete(recordsToUpload, failedRecords);
      }

      // Show success and close
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const headers = requiredFields.length > 0 ? requiredFields : ['name', 'email', 'phone'];
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
    const fields = Object.keys(record);
    return fields.slice(0, 5); // Show first 5 fields
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
            {title}
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
              Upload CSV or Excel File
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select a file containing your {source} data to upload
            </Typography>

            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              size="large"
              disabled={parsing}
            >
              Choose File
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
                <strong>Selected File:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Alert>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
              >
                Download Template
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
                  Total Records
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
                  Valid Records
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
                  Failed Records
                </Typography>
                <Typography variant="h4" fontWeight="600" color="error.main">
                  {failedRecords.length}
                </Typography>
              </Paper>
            </Box>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab
                label={`Valid Records (${validRecords.length})`}
                icon={<CheckCircleIcon />}
                iconPosition="start"
              />
              <Tab
                label={`Failed Records (${failedRecords.length})`}
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
                        These records will be uploaded
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setShowValidDetails(!showValidDetails)}
                        endIcon={showValidDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      >
                        {showValidDetails ? 'Hide' : 'Show'} Details
                      </Button>
                    </Box>

                    <Collapse in={showValidDetails}>
                      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Row #</TableCell>
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
                  <Alert severity="warning">No valid records found</Alert>
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
                        These records have errors and will not be uploaded
                      </Typography>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={downloadFailedRecords}
                          sx={{ mr: 1 }}
                        >
                          Export
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setShowFailedDetails(!showFailedDetails)}
                          endIcon={showFailedDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                          {showFailedDetails ? 'Hide' : 'Show'} Details
                        </Button>
                      </Box>
                    </Box>

                    <Collapse in={showFailedDetails}>
                      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Row #</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Reason</TableCell>
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
                                    label={item.type}
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
                  <Alert severity="success">All records are valid!</Alert>
                )}
              </Box>
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
                    Uploading Records...
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {uploadProgress}% Complete
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircleIcon sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload Complete!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {validRecords.length} records uploaded successfully
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && (
          <Button onClick={handleClose}>Cancel</Button>
        )}

        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>Back</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={validRecords.length === 0}
              startIcon={<UploadIcon />}
            >
              Upload {validRecords.length} Record{validRecords.length !== 1 ? 's' : ''}
            </Button>
          </>
        )}

        {activeStep === 2 && uploadProgress === 100 && (
          <Button variant="contained" onClick={handleClose}>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BulkUpload;
