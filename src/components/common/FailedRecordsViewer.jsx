import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Collapse,
  Alert,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useDedupe } from '../../context/DedupeContext';

const FailedRecordsViewer = ({ source = null, limit = 10 }) => {
  const theme = useTheme();
  const { getUploadHistory, clearUploadHistory } = useDedupe();
  const [expandedUpload, setExpandedUpload] = useState(null);

  const uploadHistory = getUploadHistory(source, limit);

  const handleExpandClick = (uploadId) => {
    setExpandedUpload(expandedUpload === uploadId ? null : uploadId);
  };

  const downloadFailedRecords = (upload) => {
    if (!upload.failedRecords || upload.failedRecords.length === 0) return;

    const data = upload.failedRecords.map(item => ({
      'Row Number': item.rowNumber,
      'Type': item.type,
      'Reason': item.reason,
      ...item.record
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Failed Records');
    XLSX.writeFile(wb, `failed_records_${upload.source}_${new Date(upload.timestamp).toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'partial':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'duplicate':
        return <WarningIcon fontSize="small" />;
      case 'validation':
        return <ErrorIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (uploadHistory.length === 0) {
    return (
      <Alert severity="info">
        No upload history found. {source ? `Upload some ${source} records to see them here.` : 'Upload some records to see them here.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="600">
          Upload History {source && `- ${source}`}
        </Typography>
        <Box>
          <Tooltip title="Clear History">
            <IconButton
              size="small"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the upload history?')) {
                  clearUploadHistory();
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {uploadHistory.map((upload) => (
        <Card key={upload.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    {upload.filename}
                  </Typography>
                  <Chip
                    label={upload.status}
                    size="small"
                    color={getStatusColor(upload.status)}
                    icon={upload.status === 'completed' ? <CheckCircleIcon /> : <ErrorIcon />}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploaded by {upload.uploadedBy} • {formatDate(upload.timestamp)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Chip
                    label={`Total: ${upload.totalRecords}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main
                    }}
                  />
                  <Chip
                    label={`Valid: ${upload.validRecords}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main
                    }}
                  />
                  {upload.failedRecords && upload.failedRecords.length > 0 && (
                    <Chip
                      label={`Failed: ${upload.failedRecords.length}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {upload.failedRecords && upload.failedRecords.length > 0 && (
                  <>
                    <Tooltip title="Download Failed Records">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => downloadFailedRecords(upload)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={expandedUpload === upload.id ? 'Hide Details' : 'Show Details'}>
                      <IconButton
                        size="small"
                        onClick={() => handleExpandClick(upload.id)}
                      >
                        {expandedUpload === upload.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>

            {/* Failed Records Details */}
            {upload.failedRecords && upload.failedRecords.length > 0 && (
              <Collapse in={expandedUpload === upload.id} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Failed Records Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Row #</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Reason</TableCell>
                          <TableCell>Data Preview</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upload.failedRecords.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.rowNumber}</TableCell>
                            <TableCell>
                              <Chip
                                icon={getTypeIcon(item.type)}
                                label={item.type}
                                size="small"
                                color={item.type === 'duplicate' ? 'warning' : 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={item.reason}>
                                <Typography variant="caption" noWrap sx={{ maxWidth: 300, display: 'block' }}>
                                  {item.reason}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" noWrap sx={{ maxWidth: 300 }}>
                                {JSON.stringify(item.record).slice(0, 100)}...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            )}
          </CardContent>
        </Card>
      ))}

      {uploadHistory.length >= limit && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Showing last {limit} uploads. {source && `Filter by source for more specific results.`}
        </Alert>
      )}
    </Box>
  );
};

export default FailedRecordsViewer;
