import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Badge
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  CheckCircle as VerifiedIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Cancel as RejectedIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Send as SendIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

// Document Types
export const DOCUMENT_TYPES = {
  RC: 'Registration Certificate',
  PREVIOUS_POLICY: 'Previous Policy',
  INSPECTION_REPORT: 'Inspection Report',
  CKYC: 'CKYC',
  DRIVING_LICENSE: 'Driving License',
  AADHAR: 'Aadhar Card',
  PAN: 'PAN Card',
  PROPOSAL_FORM: 'Proposal Form',
  PHOTOS: 'Vehicle Photos',
  OTHER: 'Other'
};

// Document Status
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  RECEIVED: 'received',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

const DocumentCollectionTracker = ({ leadId, initialDocuments = [], onUpdate }) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [sendRequestDialog, setSendRequestDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Upload form state
  const [newDocument, setNewDocument] = useState({
    type: DOCUMENT_TYPES.RC,
    status: DOCUMENT_STATUS.RECEIVED,
    file: null,
    notes: '',
    expiryDate: '',
    tags: []
  });

  // Send request form
  const [requestChannel, setRequestChannel] = useState('email');

  const handleUploadDocument = () => {
    const document = {
      id: `DOC-${Date.now()}`,
      leadId,
      ...newDocument,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileName: newDocument.file?.name || 'document.pdf',
      fileSize: newDocument.file?.size || 0
    };

    setDocuments([...documents, document]);

    if (onUpdate) {
      onUpdate([...documents, document]);
    }

    setUploadDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setNewDocument({
      type: DOCUMENT_TYPES.RC,
      status: DOCUMENT_STATUS.RECEIVED,
      file: null,
      notes: '',
      expiryDate: '',
      tags: []
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === id
        ? { ...doc, status: newStatus, lastUpdated: new Date().toISOString() }
        : doc
    );
    setDocuments(updatedDocuments);

    if (onUpdate) {
      onUpdate(updatedDocuments);
    }
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      setDocuments(updatedDocuments);

      if (onUpdate) {
        onUpdate(updatedDocuments);
      }
    }
  };

  const handleSendRequest = () => {
    // Mock sending document request
    console.log(`Sending document request via ${requestChannel}`);
    setSendRequestDialog(false);
    setRequestChannel('email');
  };

  const handleViewDocument = (doc) => {
    if (doc.file) {
      const fileUrl = URL.createObjectURL(doc.file);
      window.open(fileUrl, '_blank');
    } else if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      alert(`Viewing document: ${doc.fileName}`);
    }
  };

  const handleDownloadDocument = (doc) => {
    if (doc.file) {
      const fileUrl = URL.createObjectURL(doc.file);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading document: ${doc.fileName}`);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      [DOCUMENT_STATUS.PENDING]: <PendingIcon />,
      [DOCUMENT_STATUS.RECEIVED]: <DocumentIcon />,
      [DOCUMENT_STATUS.VERIFIED]: <VerifiedIcon />,
      [DOCUMENT_STATUS.REJECTED]: <RejectedIcon />,
      [DOCUMENT_STATUS.EXPIRED]: <ErrorIcon />
    };
    return icons[status] || <DocumentIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      [DOCUMENT_STATUS.PENDING]: 'warning',
      [DOCUMENT_STATUS.RECEIVED]: 'info',
      [DOCUMENT_STATUS.VERIFIED]: 'success',
      [DOCUMENT_STATUS.REJECTED]: 'error',
      [DOCUMENT_STATUS.EXPIRED]: 'error'
    };
    return colors[status] || 'default';
  };

  // Calculate completion percentage
  const requiredDocs = Object.values(DOCUMENT_TYPES).slice(0, 5); // First 5 are required
  const receivedCount = requiredDocs.filter(type =>
    documents.some(doc => doc.type === type && doc.status !== DOCUMENT_STATUS.PENDING)
  ).length;
  const completionPercentage = (receivedCount / requiredDocs.length) * 100;

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === DOCUMENT_STATUS.PENDING).length,
    received: documents.filter(d => d.status === DOCUMENT_STATUS.RECEIVED).length,
    verified: documents.filter(d => d.status === DOCUMENT_STATUS.VERIFIED).length,
    rejected: documents.filter(d => d.status === DOCUMENT_STATUS.REJECTED).length
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Document Collection ({receivedCount}/{requiredDocs.length})
            </Typography>
            <Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SendIcon />}
                onClick={() => setSendRequestDialog(true)}
                sx={{ mr: 1 }}
              >
                Request Docs
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialog(true)}
              >
                Upload
              </Button>
            </Box>
          </Box>

          {/* Completion Progress */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Completion Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {Math.round(completionPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Stats */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h6">{stats.total}</Typography>
                <Typography variant="caption" color="text.secondary">Total</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h6" color="warning.main">{stats.pending}</Typography>
                <Typography variant="caption" color="text.secondary">Pending</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h6" color="info.main">{stats.received}</Typography>
                <Typography variant="caption" color="text.secondary">Received</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">{stats.verified}</Typography>
                <Typography variant="caption" color="text.secondary">Verified</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h6" color="error.main">{stats.rejected}</Typography>
                <Typography variant="caption" color="text.secondary">Rejected</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Document List */}
          {documents.length === 0 ? (
            <Alert severity="info">
              No documents uploaded yet. Click "Upload" to add documents or "Request Docs" to send a collection request.
            </Alert>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(doc.status)}
                        <Typography variant="body1" fontWeight="bold">
                          {doc.type}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(doc.status)}
                          label={doc.status}
                          size="small"
                          color={getStatusColor(doc.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="caption" display="block">
                          File: {doc.fileName} ({(doc.fileSize / 1024).toFixed(2)} KB)
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleString()} by {doc.uploadedBy}
                        </Typography>
                        {doc.expiryDate && (
                          <Typography variant="caption" display="block" color="warning.main">
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </Typography>
                        )}
                        {doc.notes && (
                          <Typography variant="caption" display="block">
                            Notes: {doc.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {doc.status === DOCUMENT_STATUS.RECEIVED && (
                        <>
                          <Tooltip title="Verify">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleUpdateStatus(doc.id, DOCUMENT_STATUS.VERIFIED)}
                            >
                              <VerifiedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleUpdateStatus(doc.id, DOCUMENT_STATUS.REJECTED)}
                            >
                              <RejectedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={newDocument.type}
                  label="Document Type"
                  onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
                >
                  {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
              >
                {newDocument.file ? newDocument.file.name : 'Choose File'}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newDocument.status}
                  label="Status"
                  onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value })}
                >
                  <MenuItem value={DOCUMENT_STATUS.RECEIVED}>Received</MenuItem>
                  <MenuItem value={DOCUMENT_STATUS.VERIFIED}>Verified</MenuItem>
                  <MenuItem value={DOCUMENT_STATUS.PENDING}>Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date (if applicable)"
                type="date"
                value={newDocument.expiryDate}
                onChange={(e) => setNewDocument({ ...newDocument, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={newDocument.notes}
                onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                multiline
                rows={2}
                placeholder="Add any notes about this document..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setUploadDialog(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadDocument}
            disabled={!newDocument.type || !newDocument.file}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Document Request Dialog */}
      <Dialog open={sendRequestDialog} onClose={() => setSendRequestDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Request Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Send document collection request via:
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Channel</InputLabel>
              <Select
                value={requestChannel}
                label="Channel"
                onChange={(e) => setRequestChannel(e.target.value)}
              >
                <MenuItem value="email">
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" />
                    Email
                  </Box>
                </MenuItem>
                <MenuItem value="whatsapp">
                  <Box display="flex" alignItems="center" gap={1}>
                    <WhatsAppIcon fontSize="small" />
                    WhatsApp
                  </Box>
                </MenuItem>
                <MenuItem value="link">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinkIcon fontSize="small" />
                    Generate Upload Link
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info" sx={{ mt: 2 }}>
              A document upload request with required documents list will be sent to the customer.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendRequestDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendRequest}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCollectionTracker;
