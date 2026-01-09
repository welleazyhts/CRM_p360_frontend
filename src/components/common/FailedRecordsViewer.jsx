import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { getUploadHistory: getDedupeHistory, clearUploadHistory: clearDedupeHistory } = useDedupe();
  const [expandedUpload, setExpandedUpload] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);

  // Fetch history from API if source is customers, otherwise use context
  const [uploadHistory, setUploadHistory] = useState([]);

  React.useEffect(() => {
    const loadHistory = async () => {
      if (source === 'customers') {
        try {
          // Import dynamically to avoid circular dependencies if any, or just use imported service
          const { getUploadHistory } = await import('../../services/CustomerService');
          const history = await getUploadHistory();
          setUploadHistory(history || []);
        } catch (error) {
          console.error('Failed to load customer history', error);
        }
      } else {
        setUploadHistory(getDedupeHistory(source, limit));
      }
    };
    loadHistory();
  }, [source, limit, getDedupeHistory]);

  const handleClearHistory = async () => {
    if (source === 'customers') {
      try {
        const { clearUploadHistory } = await import('../../services/CustomerService');
        await clearUploadHistory();
        setUploadHistory([]);
      } catch (error) {
        console.error('Failed to clear customer history', error);
      }
    } else {
      clearDedupeHistory();
      // Force refresh (context update should handle it, but here we manage local state for api)
    }
  };

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
        {t('upload.noHistory', { source: source ? t(`leads.${source}`) : '' })}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="600">
          {t('upload.historyTitle')} {source && `- ${t(`leads.${source}`) || source}`}
        </Typography>
        <Box>
          <Tooltip title={t('upload.clearHistory')}>
            <IconButton
              size="small"
              onClick={() => {
                handleClearHistory();
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
                    label={t(`leads.bulk.${upload.status}`) || upload.status}
                    size="small"
                    color={getStatusColor(upload.status)}
                    icon={upload.status === 'completed' ? <CheckCircleIcon /> : <ErrorIcon />}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('upload.uploadedBy', { user: upload.uploadedBy })} • {formatDate(upload.timestamp)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Chip
                    label={t('upload.summary.total') + ': ' + upload.totalRecords}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main
                    }}
                  />
                  <Chip
                    label={t('upload.summary.valid') + ': ' + upload.validRecords}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main
                    }}
                  />
                  {upload.failedRecords && upload.failedRecords.length > 0 && (
                    <Chip
                      label={t('upload.summary.failed') + ': ' + upload.failedRecords.length}
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
                    <Tooltip title={t('upload.downloadFailed')}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => downloadFailedRecords(upload)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={expandedUpload === upload.id ? t('common.hide') + ' ' + t('common.details') : t('common.show') + ' ' + t('common.details')}>
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
                    {t('upload.failedDetailsTitle')}
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('upload.rowNumber')}</TableCell>
                          <TableCell>{t('upload.type')}</TableCell>
                          <TableCell>{t('upload.reason')}</TableCell>
                          <TableCell>{t('upload.dataPreview')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upload.failedRecords.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.rowNumber}</TableCell>
                            <TableCell>
                              <Chip
                                icon={getTypeIcon(item.type)}
                                label={t(`upload.types.${item.type}`) || item.type}
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

      <Alert severity="info" sx={{ mt: 2 }}>
        {t('upload.showLastLimit', { limit })}
      </Alert>
    </Box>
  );
};

export default FailedRecordsViewer;
