import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Chip, IconButton,
  Card, CardContent, Grow, alpha, Button, Checkbox, Tooltip,
  Menu, MenuItem, FormControl, InputLabel, Select, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  ThumbDown as ThumbDownIcon,
  Call as CallIcon,
  EditNote as EditNoteIcon,
  Comment as CommentIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const NotInterestedCases = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cases, setCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [policyStatusFilter, setPolicyStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Action States
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [actionCase, setActionCase] = useState(null);
  const [editFormData, setEditFormData] = useState({ priority: '', status: '', reason: '' });
  const [commentText, setCommentText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for Not Interested cases
  const mockNotInterestedCases = [
    {
      id: 'CASE-NI-001',
      customerName: 'Rajesh Kumar',
      policyNumber: 'POL-67890',
      status: 'Not Interested',
      agent: 'Amit Singh',
      uploadDate: '2025-04-05',
      customerMobile: '9876543211',
      alternateMobile: '9876543299',
      preferredLanguage: 'Hindi',
      productName: 'Health Insurance',
      productCategory: 'Health',
      channel: 'Phone',
      currentCommunicationChannel: 'Phone',
      batchId: 'BATCH-001',
      policyStatus: 'Active',
      priority: 'High',
      lastAction: '2025-04-07',
      callCount: 3,
      renewalDate: '2025-05-15',
      reason: 'Found cheaper alternative',
      markedDate: '2025-04-07',
      profile: 'Individual'
    },
    {
      id: 'CASE-NI-002',
      customerName: 'Sunita Verma',
      policyNumber: 'POL-67891',
      status: 'Not Interested',
      agent: 'Priya Patel',
      uploadDate: '2025-04-03',
      customerMobile: '9876543212',
      alternateMobile: '9876543288',
      preferredLanguage: 'English',
      productName: 'Vehicle Insurance',
      productCategory: 'Motor',
      channel: 'Email',
      currentCommunicationChannel: 'Email',
      batchId: 'BATCH-002',
      policyStatus: 'Expiring',
      priority: 'Medium',
      lastAction: '2025-04-06',
      callCount: 2,
      renewalDate: '2025-05-20',
      reason: 'Not planning to renew',
      markedDate: '2025-04-06',
      profile: 'Corporate'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setCases(mockNotInterestedCases);
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const applyAllFilters = (search, date, agent, policyStatus, priority) => {
    let filtered = [...mockNotInterestedCases];

    // Search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(caseItem =>
        caseItem.id.toLowerCase().includes(search.toLowerCase()) ||
        caseItem.customerName.toLowerCase().includes(search.toLowerCase()) ||
        caseItem.policyNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Date filter
    if (date !== 'all') {
      const today = new Date();
      filtered = filtered.filter(caseItem => {
        const caseDate = new Date(caseItem.markedDate);
        switch (date) {
          case 'today':
            return caseDate.toDateString() === today.toDateString();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return caseDate.toDateString() === yesterday.toDateString();
          case 'lastWeek':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return caseDate >= weekAgo;
          case 'lastMonth':
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 30);
            return caseDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Agent filter
    if (agent !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.agent === agent);
    }

    // Policy Status filter
    if (policyStatus !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.policyStatus === policyStatus);
    }

    // Priority filter
    if (priority !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.priority === priority);
    }

    setCases(filtered);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyAllFilters(value, dateFilter, agentFilter, policyStatusFilter, priorityFilter);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    applyAllFilters(searchTerm, dateFilter, agentFilter, policyStatusFilter, priorityFilter);
  };

  const handleDateFilterChange = (event) => {
    const newDateFilter = event.target.value;
    setDateFilter(newDateFilter);
    applyAllFilters(searchTerm, newDateFilter, agentFilter, policyStatusFilter, priorityFilter);
  };

  const handleAgentFilterChange = (event) => {
    const newAgentFilter = event.target.value;
    setAgentFilter(newAgentFilter);
    applyAllFilters(searchTerm, dateFilter, newAgentFilter, policyStatusFilter, priorityFilter);
  };

  const handlePolicyStatusFilterChange = (event) => {
    const newPolicyStatusFilter = event.target.value;
    setPolicyStatusFilter(newPolicyStatusFilter);
    applyAllFilters(searchTerm, dateFilter, agentFilter, newPolicyStatusFilter, priorityFilter);
  };

  const handlePriorityFilterChange = (event) => {
    const newPriorityFilter = event.target.value;
    setPriorityFilter(newPriorityFilter);
    applyAllFilters(searchTerm, dateFilter, agentFilter, policyStatusFilter, newPriorityFilter);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCustomerNameClick = (customerName, customerId) => {
    navigate(`/policy-timeline?customerName=${encodeURIComponent(customerName)}&customerId=${encodeURIComponent(customerId || 'CUST-' + Math.floor(Math.random() * 10000))}&source=not-interested`);
  };

  const handleSelectCase = (caseId, checked) => {
    if (checked) {
      setSelectedCases([...selectedCases, caseId]);
    } else {
      setSelectedCases(selectedCases.filter(id => id !== caseId));
    }
  };

  const handleSelectAllCases = (checked) => {
    if (checked) {
      const allCaseIds = cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => c.id);
      setSelectedCases(allCaseIds);
    } else {
      setSelectedCases([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  // --- Action Handlers ---

  const handleCallClick = (caseItem) => {
    setActionCase(caseItem);
    setOpenCallDialog(true);
  };

  const handleEditClick = (caseItem) => {
    setActionCase(caseItem);
    setEditFormData({
      priority: caseItem.priority,
      status: caseItem.status,
      reason: caseItem.reason || ''
    });
    setOpenEditDialog(true);
  };

  const handleCommentClick = (caseItem) => {
    setActionCase(caseItem);
    setCommentText('');
    setOpenCommentDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenCallDialog(false);
    setOpenEditDialog(false);
    setOpenCommentDialog(false);
    setActionCase(null);
  };

  const handleConfirmCall = () => {
    if (!actionCase) return;

    // Simulate call logic
    setSnackbar({
      open: true,
      message: `Calling ${actionCase.customerName} (${actionCase.customerMobile})...`,
      severity: 'success'
    });

    // Update call count locally
    const updatedCases = cases.map(c =>
      c.id === actionCase.id ? { ...c, callCount: (c.callCount || 0) + 1, lastAction: new Date().toISOString().split('T')[0] } : c
    );
    setCases(updatedCases);
    handleCloseDialogs();
  };

  const handleSaveEdit = () => {
    if (!actionCase) return;

    const updatedCases = cases.map(c =>
      c.id === actionCase.id ? {
        ...c,
        priority: editFormData.priority,
        status: editFormData.status,
        reason: editFormData.reason,
        lastAction: new Date().toISOString().split('T')[0]
      } : c
    );
    setCases(updatedCases);

    setSnackbar({
      open: true,
      message: 'Case details updated successfully',
      severity: 'success'
    });
    handleCloseDialogs();
  };

  const handleSaveComment = () => {
    if (!actionCase) return;
    if (!commentText.trim()) {
      setSnackbar({ open: true, message: 'Please enter a comment', severity: 'warning' });
      return;
    }

    setSnackbar({
      open: true,
      message: 'Comment added successfully',
      severity: 'success'
    });
    handleCloseDialogs();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThumbDownIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />
          <Typography variant="h4" fontWeight="600">
            Not Interested Cases
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              fontWeight: 600,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              }
            }}
          >
            Filter
          </Button>
          <Chip
            label={`${cases.length} Cases`}
            color="error"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Search */}
      <Grow in={loaded} timeout={400}>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              placeholder="Search by Case ID, Customer Name or Policy Number"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                }
              }}
            />
          </CardContent>
        </Card>
      </Grow>

      {/* Table */}
      <Grow in={loaded} timeout={600}>
        <Card elevation={0} sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 80, textAlign: 'center' }}>
                      <Checkbox
                        indeterminate={selectedCases.length > 0 && selectedCases.length < cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                        checked={cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 && selectedCases.length === cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                        onChange={(e) => handleSelectAllCases(e.target.checked)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 180, textAlign: 'center' }}>Actions</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 180 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Profile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Mobile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 130 }}>Language</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>Policy Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 200 }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 170 }}>Channel</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>CCC(cur.comm.ch.)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 130 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Policy Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>Agent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Last Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Calls</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Renewal Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Upload Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((caseItem, index) => (
                    <TableRow
                      key={caseItem.id}
                      hover
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.2s, transform 0.1s',
                        bgcolor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          zIndex: 1,
                        },
                        '& .MuiTableCell-root': {
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                          py: 2,
                          px: 2,
                          fontSize: '0.875rem',
                          verticalAlign: 'middle'
                        }
                      }}
                    >
                      <TableCell
                        sx={{ textAlign: 'center', width: 80 }}
                        onClick={(e) => e.stopPropagation()} // Fix: Prevent row click
                      >
                        <Checkbox
                          checked={selectedCases.includes(caseItem.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectCase(caseItem.id, e.target.checked);
                          }}
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', width: 180 }}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Call Lead" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallClick(caseItem);
                              }}
                              sx={{
                                color: theme.palette.success.main,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  transform: 'scale(1.15)'
                                }
                              }}
                            >
                              <CallIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View Details" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/cases/${caseItem.id}`);
                              }}
                              sx={{
                                color: 'primary.main',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.15)' }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Quick Edit" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(caseItem);
                              }}
                              sx={{
                                color: 'info.main',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.15)' }
                              }}
                            >
                              <EditNoteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Add Comment" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentClick(caseItem);
                              }}
                              sx={{
                                color: 'secondary.main',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.15)' }
                              }}
                            >
                              <CommentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{caseItem.id}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerNameClick(caseItem.customerName, caseItem.id);
                          }}
                          sx={{
                            textTransform: 'none',
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {caseItem.customerName}
                        </Button>
                      </TableCell>
                      <TableCell>{caseItem.profile}</TableCell>
                      <TableCell>{caseItem.customerMobile}</TableCell>
                      <TableCell>{caseItem.preferredLanguage}</TableCell>
                      <TableCell>{caseItem.policyNumber}</TableCell>
                      <TableCell>{caseItem.productName}</TableCell>
                      <TableCell>{caseItem.productCategory}</TableCell>
                      <TableCell>{caseItem.channel}</TableCell>
                      <TableCell>{caseItem.currentCommunicationChannel}</TableCell>
                      <TableCell>{caseItem.batchId}</TableCell>
                      <TableCell>
                        <Chip
                          label={caseItem.status}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{caseItem.policyStatus}</TableCell>
                      <TableCell>{caseItem.agent}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip
                          icon={<FlagIcon />}
                          label={caseItem.priority}
                          color={getPriorityColor(caseItem.priority)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{caseItem.lastAction}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip
                          label={caseItem.callCount}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>{caseItem.renewalDate}</TableCell>
                      <TableCell>{caseItem.uploadDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={cases.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </CardContent>
        </Card>
      </Grow>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: '220px',
            mt: 1,
            p: 1,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 1, pb: 2, fontWeight: 600 }}>
          Filter Cases
        </Typography>

        <MenuItem sx={{ py: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Date</InputLabel>
            <Select
              value={dateFilter}
              label="Date"
              onChange={handleDateFilterChange}
              sx={{
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="lastWeek">Last 7 Days</MenuItem>
              <MenuItem value="lastMonth">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem sx={{ py: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Agent</InputLabel>
            <Select
              value={agentFilter}
              label="Agent"
              onChange={handleAgentFilterChange}
              sx={{
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="all">All Agents</MenuItem>
              <MenuItem value="Amit Singh">Amit Singh</MenuItem>
              <MenuItem value="Priya Patel">Priya Patel</MenuItem>
              <MenuItem value="Ravi Sharma">Ravi Sharma</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem sx={{ py: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Policy Status</InputLabel>
            <Select
              value={policyStatusFilter}
              label="Policy Status"
              onChange={handlePolicyStatusFilterChange}
              sx={{
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="all">All Policy Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Expiring">Expiring</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Lapsed">Lapsed</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem sx={{ py: 1.5 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={handlePriorityFilterChange}
              sx={{
                borderRadius: 2,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, px: 1 }}>
          <Button
            variant="contained"
            onClick={handleFilterClose}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 2,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
              }
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Menu>

      {/* --- Action Dialogs --- */}

      {/* Call Dialog */}
      <Dialog open={openCallDialog} onClose={handleCloseDialogs} maxWidth="xs" fullWidth>
        <DialogTitle>Call Customer</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CallIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6">{actionCase?.customerName}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              {actionCase?.customerMobile}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clicking "Start Call" will initiate a call via your configured softphone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleConfirmCall} startIcon={<CallIcon />}>
            Start Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Quick Edit Case</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editFormData.priority}
                label="Priority"
                onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editFormData.status}
                label="Status"
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <MenuItem value="Not Interested">Not Interested</MenuItem>
                <MenuItem value="Deferred">Deferred</MenuItem>
                <MenuItem value="Callback Requested">Callback Requested</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Reason / Notes"
              multiline
              rows={3}
              value={editFormData.reason}
              onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={openCommentDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter your comment here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveComment}>
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotInterestedCases;
