import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';
import WorkflowCreatorDialog from '../../components/collections/WorkflowCreatorDialog';

const PortfolioOnboarding = () => {
  const { addLog } = useActivityLog();
  const currentUser = 'Current User'; // In production, get from auth context
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [uploadMode, setUploadMode] = useState(0); // 0 = single file, 1 = multiple files
  const [portfolioInfo, setPortfolioInfo] = useState({
    portfolioName: '',
    seller: '',
    debtType: '',
    purchaseDate: '',
    totalFaceValue: '',
    purchasePrice: '',
    agreementNumber: ''
  });

  // Workflow Creator Dialog States
  const [workflowCreatorDialog, setWorkflowCreatorDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    type: 'payment_reminder',
    channels: ['call'],
    startDate: '',
    scheduleType: 'immediate'
  });

  // Upload History State
  const [uploadHistory] = useState([
    {
      id: 1,
      uploadDate: '2025-01-20',
      uploadTime: '14:35 PM',
      fileName: 'Portfolio_ABC_Bank_Jan2025.xlsx',
      fileSize: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      portfolioName: 'ABC Bank - Personal Loans Q1 2025',
      totalRecords: 1250,
      validRecords: 1230,
      errorRecords: 20,
      status: 'Completed'
    },
    {
      id: 2,
      uploadDate: '2025-01-18',
      uploadTime: '10:15 AM',
      fileName: 'XYZ_Digital_Lending_Portfolio.csv',
      fileSize: '3.8 MB',
      uploadedBy: 'Mike Wilson',
      portfolioName: 'XYZ Digital - Consumer Loans',
      totalRecords: 2100,
      validRecords: 2095,
      errorRecords: 5,
      status: 'Completed'
    },
    {
      id: 3,
      uploadDate: '2025-01-15',
      uploadTime: '16:45 PM',
      fileName: 'Credit_Card_Portfolio_Jan.xlsx',
      fileSize: '5.2 MB',
      uploadedBy: 'Priya Patel',
      portfolioName: 'Credit Card Receivables - Jan 2025',
      totalRecords: 3500,
      validRecords: 3450,
      errorRecords: 50,
      status: 'Completed'
    },
    {
      id: 4,
      uploadDate: '2025-01-12',
      uploadTime: '09:20 AM',
      fileName: 'Auto_Loans_Portfolio.csv',
      fileSize: '1.8 MB',
      uploadedBy: 'John Adams',
      portfolioName: 'Auto Finance - Subprime Loans',
      totalRecords: 850,
      validRecords: 850,
      errorRecords: 0,
      status: 'Completed'
    },
    {
      id: 5,
      uploadDate: '2025-01-10',
      uploadTime: '11:30 AM',
      fileName: 'Medical_Debt_Collection.xlsx',
      fileSize: '4.1 MB',
      uploadedBy: 'Sarah Johnson',
      portfolioName: 'Healthcare Receivables Portfolio',
      totalRecords: 1850,
      validRecords: 1720,
      errorRecords: 130,
      status: 'Completed'
    }
  ]);

  const steps = [
    'Upload Data Files',
    'Validate & Clean Data',
    'Portfolio Information',
    'Account Segmentation',
    'Review & Import'
  ];

  const dataFileTypes = [
    { name: 'Customer List', required: true, uploaded: false },
    { name: 'Payment History', required: true, uploaded: false },
    { name: 'Balances & Amounts', required: true, uploaded: false },
    { name: 'Contact Information', required: true, uploaded: false }
  ];

  const documentFileTypes = [
    { name: 'SPA (Sale & Purchase Agreement)', required: true, uploaded: false },
    { name: 'Additional Documents', required: false, uploaded: false }
  ];

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        name: file.name,
        type: fileType,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleString(),
        status: 'processing',
        records: Math.floor(Math.random() * 10000) + 1000,
        validRecords: 0,
        invalidRecords: 0
      };

      // If this is a Portfolio Data File upload, show workflow creator dialog
      if (fileType === 'Portfolio Data File') {
        setPendingFile(newFile);
        setWorkflowCreatorDialog(true);
      } else {
        // For other file types, proceed normally
        setUploadedFiles([...uploadedFiles, newFile]);

        // Simulate processing
        setTimeout(() => {
          const processed = uploadedFiles.map(f =>
            f.name === newFile.name
              ? { ...f, status: 'validated', validRecords: f.records - Math.floor(Math.random() * 100), invalidRecords: Math.floor(Math.random() * 100) }
              : f
          );
          setUploadedFiles(processed);
        }, 2000);
      }
    }
  };

  const handleWorkflowSave = (workflow) => {
    // Save the workflow configuration
    setWorkflowData(workflow);

    // Add the pending file to uploaded files now that workflow is configured
    if (pendingFile) {
      setUploadedFiles([...uploadedFiles, pendingFile]);

      // Simulate processing
      setTimeout(() => {
        setUploadedFiles(files => files.map(f =>
          f.name === pendingFile.name
            ? { ...f, status: 'validated', validRecords: f.records - Math.floor(Math.random() * 100), invalidRecords: Math.floor(Math.random() * 100) }
            : f
        ));
      }, 2000);
    }

    // Log the workflow creation
    addLog({
      user: currentUser,
      action: 'Workflow Created',
      entity: 'Portfolio Onboarding',
      entityId: 'workflow-setup',
      entityName: workflow.name || 'New Workflow',
      details: `Created workflow for portfolio data: ${workflow.name}, Type: ${workflow.type}, Channels: ${workflow.channels.join(', ')}`,
      category: 'workflow',
      status: 'success'
    });

    setPendingFile(null);
  };

  const mockValidationData = {
    totalRecords: 5432,
    validRecords: 5124,
    invalidRecords: 308,
    duplicates: 45,
    missingFields: 120,
    formatErrors: 89,
    dataQuality: 94.3,
    issues: [
      { field: 'Phone Number', count: 78, severity: 'warning', issue: 'Invalid format' },
      { field: 'Customer ID', count: 45, severity: 'error', issue: 'Duplicate entries' },
      { field: 'Email', count: 120, severity: 'warning', issue: 'Missing value' },
      { field: 'Address', count: 65, severity: 'info', issue: 'Incomplete address' }
    ],
    // Mock invalid records for export
    invalidRecordsData: [
      { rowNumber: 12, customerID: 'CUST-001', name: 'John Doe', phone: '123-ABC', email: 'john@', address: '123 Main St', balance: 5000, error: 'Invalid phone format' },
      { rowNumber: 45, customerID: 'CUST-002', name: 'Jane Smith', phone: '9876543210', email: '', address: '456 Oak Ave', balance: 3200, error: 'Missing email' },
      { rowNumber: 78, customerID: 'CUST-001', name: 'John Doe', phone: '1234567890', email: 'john@example.com', address: '123 Main St', balance: 5000, error: 'Duplicate Customer ID' },
      { rowNumber: 92, customerID: 'CUST-004', name: 'Bob Johnson', phone: '', email: 'bob@example.com', address: '', balance: 1500, error: 'Missing phone and incomplete address' },
      { rowNumber: 134, customerID: 'CUST-005', name: 'Alice Brown', phone: 'invalid', email: 'alice@test', address: '789 Pine Rd', balance: 4200, error: 'Invalid phone format and email domain' },
      { rowNumber: 201, customerID: 'CUST-006', name: '', phone: '5551234567', email: 'contact@example.com', address: '321 Elm St', balance: 2800, error: 'Missing customer name' },
      { rowNumber: 287, customerID: 'CUST-007', name: 'Charlie Wilson', phone: '9998887777', email: 'charlie.wilson@mail', address: 'Apt 5', balance: 6100, error: 'Incomplete address' }
    ]
  };

  const handleExportInvalidRecords = () => {
    if (!validationResults || !validationResults.invalidRecordsData) {
      return;
    }

    // Convert data to CSV format
    const headers = ['Row Number', 'Customer ID', 'Name', 'Phone', 'Email', 'Address', 'Balance', 'Error/Issue'];
    const csvContent = [
      headers.join(','),
      ...validationResults.invalidRecordsData.map(record =>
        [
          record.rowNumber,
          record.customerID,
          `"${record.name}"`,
          record.phone,
          record.email,
          `"${record.address}"`,
          record.balance,
          `"${record.error}"`
        ].join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Invalid_Records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Log the export activity
    addLog({
      user: currentUser,
      action: 'Invalid Records Exported',
      entity: 'Portfolio Onboarding',
      entityId: 'validation-export',
      entityName: `${validationResults.invalidRecords} invalid records`,
      details: `Exported ${validationResults.invalidRecords} invalid records to CSV for review and correction`,
      category: 'data',
      status: 'success'
    });
  };

  const handleNext = () => {
    if (activeStep === 1) {
      setValidationResults(mockValidationData);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDeleteFile = (fileToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${fileToDelete.name}"?`)) {
      setUploadedFiles(uploadedFiles.filter(f => f.name !== fileToDelete.name));
      addLog({
        user: currentUser,
        action: 'File Deleted',
        entity: 'Portfolio Onboarding',
        entityId: 'file-upload',
        entityName: fileToDelete.name,
        details: `Deleted uploaded file: ${fileToDelete.name} (${fileToDelete.type})`,
        category: 'data',
        status: 'success'
      });
    }
  };

  const handleImportPortfolio = () => {
    // Log the import activity
    addLog({
      user: currentUser,
      action: 'Portfolio Imported',
      entity: 'Portfolio Onboarding',
      entityId: 'portfolio-import',
      entityName: portfolioInfo.portfolioName || 'New Portfolio',
      details: `Imported portfolio: ${portfolioInfo.portfolioName}, Seller: ${portfolioInfo.seller}, Total Records: ${validationResults?.totalRecords || 0}`,
      category: 'data',
      status: 'success'
    });

    alert(`Portfolio "${portfolioInfo.portfolioName}" imported successfully!\n\nTotal Records: ${validationResults?.totalRecords || 0}\nValid Records: ${validationResults?.validRecords || 0}\n\nThis will be connected to backend API for actual import.`);

    // Reset form
    setActiveStep(0);
    setUploadedFiles([]);
    setValidationResults(null);
    setPortfolioInfo({
      portfolioName: '',
      seller: '',
      debtType: '',
      purchaseDate: '',
      totalFaceValue: '',
      purchasePrice: '',
      agreementNumber: ''
    });
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setPreviewDialog(true);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Upload all required files for portfolio onboarding. Supported formats: CSV, Excel (.xlsx, .xls), JSON
            </Alert>

            <Tabs value={uploadMode} onChange={(e, newValue) => setUploadMode(newValue)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Single File Upload" value={0} />
              <Tab label="Multiple Files Upload" value={1} />
            </Tabs>

            {uploadMode === 0 ? (
              // Single File Upload Mode
              <Box>
                <Grid container spacing={3}>
                  {/* Main Portfolio Data File */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box flex={1}>
                            <Typography variant="h6" gutterBottom>
                              Portfolio Data File
                              <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Upload a single file containing all portfolio data (Customer List, Payment History, Balances, Contact Information)
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                            size="large"
                          >
                            Upload File
                            <input
                              type="file"
                              hidden
                              accept=".csv,.xlsx,.xls,.json"
                              onChange={(e) => handleFileUpload(e, 'Portfolio Data File')}
                            />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* SPA and Additional Documents */}
                  {documentFileTypes.map((fileType, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {fileType.name}
                                {fileType.required && (
                                  <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {fileType.uploaded ? 'File uploaded' : 'No file uploaded'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<UploadIcon />}
                              size="small"
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileUpload(e, fileType.name)}
                              />
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              // Multiple Files Upload Mode
              <Box>
                <Grid container spacing={3}>
                  {/* Data Files */}
                  {dataFileTypes.map((fileType, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {fileType.name}
                                {fileType.required && (
                                  <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {fileType.uploaded ? 'File uploaded' : 'No file uploaded'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<UploadIcon />}
                              size="small"
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept=".csv,.xlsx,.xls,.json"
                                onChange={(e) => handleFileUpload(e, fileType.name)}
                              />
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  {/* SPA and Additional Documents */}
                  {documentFileTypes.map((fileType, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {fileType.name}
                                {fileType.required && (
                                  <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {fileType.uploaded ? 'File uploaded' : 'No file uploaded'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              component="label"
                              startIcon={<UploadIcon />}
                              size="small"
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileUpload(e, fileType.name)}
                              />
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {uploadedFiles.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Uploaded Files
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>File Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Records</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadedFiles.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <FileIcon sx={{ mr: 1 }} />
                              {file.name}
                            </Box>
                          </TableCell>
                          <TableCell>{file.type}</TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{file.records.toLocaleString()}</TableCell>
                          <TableCell>
                            {file.status === 'processing' && (
                              <Chip label="Processing..." color="warning" size="small" />
                            )}
                            {file.status === 'validated' && (
                              <Chip label="Validated" color="success" size="small" icon={<CheckIcon />} />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handlePreview(file)}>
                              <ViewIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteFile(file)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Data validation completed! Review the results below.
            </Alert>

            {validationResults && (
              <>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Total Records
                        </Typography>
                        <Typography variant="h4">
                          {validationResults.totalRecords.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Valid Records
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {validationResults.validRecords.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Invalid Records
                        </Typography>
                        <Typography variant="h4" color="error.main">
                          {validationResults.invalidRecords.toLocaleString()}
                        </Typography>
                        {validationResults.invalidRecords > 0 && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportInvalidRecords}
                            sx={{ mt: 2 }}
                            fullWidth
                          >
                            Export Invalid Data
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Data Quality
                        </Typography>
                        <Typography variant="h4" color="primary.main">
                          {validationResults.dataQuality}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Validation Issues
                  </Typography>
                  {validationResults.invalidRecords > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportInvalidRecords}
                      size="small"
                    >
                      Export {validationResults.invalidRecords} Invalid Records
                    </Button>
                  )}
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Severity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validationResults.issues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.field}</TableCell>
                          <TableCell>{issue.issue}</TableCell>
                          <TableCell>{issue.count}</TableCell>
                          <TableCell>
                            <Chip
                              label={issue.severity.toUpperCase()}
                              color={
                                issue.severity === 'error' ? 'error' :
                                issue.severity === 'warning' ? 'warning' : 'info'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Portfolio Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Portfolio Name"
                  value={portfolioInfo.portfolioName}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, portfolioName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Seller / Original Creditor"
                  value={portfolioInfo.seller}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, seller: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Debt Type</InputLabel>
                  <Select
                    value={portfolioInfo.debtType}
                    label="Debt Type"
                    onChange={(e) => setPortfolioInfo({...portfolioInfo, debtType: e.target.value})}
                  >
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="personal_loan">Personal Loan</MenuItem>
                    <MenuItem value="auto_loan">Auto Loan</MenuItem>
                    <MenuItem value="medical">Medical Debt</MenuItem>
                    <MenuItem value="utility">Utility</MenuItem>
                    <MenuItem value="telecom">Telecom</MenuItem>
                    <MenuItem value="mixed">Mixed Portfolio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  type="date"
                  value={portfolioInfo.purchaseDate}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, purchaseDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Face Value"
                  type="number"
                  value={portfolioInfo.totalFaceValue}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, totalFaceValue: e.target.value})}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  value={portfolioInfo.purchasePrice}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, purchasePrice: e.target.value})}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SPA Agreement Number"
                  value={portfolioInfo.agreementNumber}
                  onChange={(e) => setPortfolioInfo({...portfolioInfo, agreementNumber: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Segmentation
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              System will automatically segment accounts based on the criteria below
            </Alert>

            <Grid container spacing={3}>
              {[
                { name: 'Ready-to-Pay', count: 1245, percentage: 23, color: 'success' },
                { name: 'Contactable but Not Paying', count: 2156, percentage: 40, color: 'warning' },
                { name: 'Hard-to-Contact', count: 1123, percentage: 21, color: 'error' },
                { name: 'Skip-trace Required', count: 456, percentage: 8, color: 'info' },
                { name: 'Legal Cases', count: 452, percentage: 8, color: 'secondary' }
              ].map((segment, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{segment.name}</Typography>
                      <Typography variant="h4" color={`${segment.color}.main`}>
                        {segment.count.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {segment.percentage}% of total accounts
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={segment.percentage}
                        color={segment.color}
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review & Confirm Import
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Please review all information before importing. This action cannot be undone.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Portfolio Summary</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Portfolio Name:</Typography>
                        <Typography variant="body1">{portfolioInfo.portfolioName || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Seller:</Typography>
                        <Typography variant="body1">{portfolioInfo.seller || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Total Accounts:</Typography>
                        <Typography variant="body1">{validationResults?.validRecords.toLocaleString() || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Total Face Value:</Typography>
                        <Typography variant="body1">${portfolioInfo.totalFaceValue || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Portfolio Onboarding
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Import debt portfolios from banks and digital lenders
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box minHeight="400px">
            {renderStepContent(activeStep)}
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="success" size="large" onClick={handleImportPortfolio}>
                  Import Portfolio
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={activeStep === 0 && uploadedFiles.length === 0}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upload History Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>
              Upload History
            </Typography>
            <Chip label={`${uploadHistory.length} Uploads`} color="primary" />
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Upload Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Uploaded By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Portfolio Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Records</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No upload history available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  uploadHistory.map((upload) => (
                    <TableRow key={upload.id} hover>
                      <TableCell>
                        <Typography variant="body2">{upload.uploadDate}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {upload.uploadTime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <FileIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {upload.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {upload.fileSize}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{upload.uploadedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {upload.portfolioName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {upload.totalRecords.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            {upload.validRecords} valid
                          </Typography>
                          {upload.errorRecords > 0 && (
                            <Typography variant="caption" color="error.main" display="block">
                              {upload.errorRecords} errors
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={upload.status}
                          size="small"
                          color={
                            upload.status === 'Completed' ? 'success' :
                            upload.status === 'Processing' ? 'warning' :
                            upload.status === 'Failed' ? 'error' : 'default'
                          }
                          icon={
                            upload.status === 'Completed' ? <CheckIcon /> :
                            upload.status === 'Failed' ? <ErrorIcon /> : null
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="View Details">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title="Download File">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* File Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>File Name:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {selectedFile.type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Records:</strong> {selectedFile.records?.toLocaleString()}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                Preview functionality will be implemented with actual data
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Creator Dialog */}
      <WorkflowCreatorDialog
        open={workflowCreatorDialog}
        onClose={() => {
          setWorkflowCreatorDialog(false);
          setPendingFile(null);
        }}
        onSave={handleWorkflowSave}
      />
    </Box>
  );
};

export default PortfolioOnboarding;
