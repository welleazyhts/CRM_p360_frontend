import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography, Card, CardContent, Grid, Chip, IconButton,
  Paper, Collapse, Tooltip, Stack, Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as DocumentIcon,
  CreditCard as CertificateIcon,
  LocalHospital as HealthCardIcon,
  Notifications as NoticeIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  FilePresent as FileIcon
} from '@mui/icons-material';
import './PreviousPolicyDocuments.css';
import { getPolicyDocuments, downloadDocument, viewDocument } from '../../services/documentService';

const PreviousPolicyDocuments = ({ policy }) => {
  const [expanded, setExpanded] = useState(false);
  const [documents, setDocuments] = useState({
    premiumCertificates: [],
    healthCards: [],
    policyDocuments: [],
    renewalNotices: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      if (expanded) {
        setLoading(true);
        try {
          const policyDocuments = await getPolicyDocuments(policy.policyNumber);
          setDocuments(policyDocuments);
        } catch (error) {
          console.error('Error loading documents:', error);
          setDocuments({
            premiumCertificates: [],
            healthCards: [],
            policyDocuments: [],
            renewalNotices: []
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadDocuments();
  }, [expanded, policy.policyNumber]);

  const currentDocuments = loading ? { premiumCertificates: [], healthCards: [], policyDocuments: [], renewalNotices: [] } : documents;
  const totalDocuments = 
    currentDocuments.premiumCertificates.length +
    currentDocuments.healthCards.length +
    currentDocuments.policyDocuments.length +
    currentDocuments.renewalNotices.length;

  const handleDownload = async (document) => {
    try {
      await downloadDocument(document);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleView = async (document) => {
    try {
      await viewDocument(document);
    } catch (error) {
      console.error('View failed:', error);
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Verified':
      case 'Delivered':
      case 'Sent':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Expired':
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleToggleExpand}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {policy.policyNumber} - Related Documents
            </Typography>
            <Chip
              label={`${totalDocuments} documents`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </CardContent>

      <Collapse in={expanded}>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Loading documents...
              </Typography>
            </Box>
          )}

          {!loading && (
            <Grid container spacing={3}>
              {/* Premium Paid Certificates */}
              {currentDocuments.premiumCertificates.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CertificateIcon color="primary" />
                      Premium Paid Certificates
                    </Typography>
                    <Stack spacing={1}>
                      {currentDocuments.premiumCertificates.map((cert) => (
                        <Paper key={cert.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {cert.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Date: {cert.date} | Amount: {cert.amount}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  label={cert.status}
                                  size="small"
                                  color={getStatusColor(cert.status)}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton size="small" onClick={() => handleView(cert)}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={() => handleDownload(cert)}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {/* Health Cards */}
              {currentDocuments.healthCards.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <HealthCardIcon color="success" />
                      Health Cards
                    </Typography>
                    <Stack spacing={1}>
                      {currentDocuments.healthCards.map((card) => (
                        <Paper key={card.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {card.memberName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Card: {card.cardNumber}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Valid until: {card.validUpto}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  label={card.status}
                                  size="small"
                                  color={getStatusColor(card.status)}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton size="small" onClick={() => handleView(card)}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={() => handleDownload(card)}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {/* Policy Documents */}
              {currentDocuments.policyDocuments.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <DocumentIcon color="info" />
                      Policy Documents
                    </Typography>
                    <Stack spacing={1}>
                      {currentDocuments.policyDocuments.map((doc) => (
                        <Paper key={doc.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {doc.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Type: {doc.type} | Version: {doc.version}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Date: {doc.date} | Size: {doc.fileSize}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton size="small" onClick={() => handleView(doc)}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={() => handleDownload(doc)}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {/* Renewal Notices */}
              {currentDocuments.renewalNotices.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <NoticeIcon color="warning" />
                      Renewal Notices
                    </Typography>
                    <Stack spacing={1}>
                      {currentDocuments.renewalNotices.map((notice) => (
                        <Paper key={notice.id} variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {notice.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Notice Date: {notice.noticeDate}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Due Date: {notice.dueDate} | Channel: {notice.channel}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  label={notice.status}
                                  size="small"
                                  color={getStatusColor(notice.status)}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="View">
                                <IconButton size="small" onClick={() => handleView(notice)}>
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={() => handleDownload(notice)}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {totalDocuments === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No documents available for this policy
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

PreviousPolicyDocuments.propTypes = {
  policy: PropTypes.shape({
    id: PropTypes.number.isRequired,
    policyNumber: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
};

export default PreviousPolicyDocuments;