import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Chip, IconButton,
  Card, CardContent, Grow, alpha, Button, Checkbox, Tooltip,
  Menu, MenuItem, FormControl, InputLabel, Select, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  Call as CallIcon,
  EditNote as EditNoteIcon,
  Comment as CommentIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const RenewalFailedCases = () => {
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

  // Mock data for Renewal Failed cases
  const mockRenewalFailedCases = [
    {
      id: 'CASE-RF-001',
      customerName: 'Vikram Malhotra',
      policyNumber: 'POL-78901',
      status: 'Renewal Failed',
      agent: 'Ravi Sharma',
      uploadDate: '2025-04-01',
      customerMobile: '9876543213',
      alternateMobile: '9876543277',
      preferredLanguage: 'English',
      productName: 'Vehicle Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      currentCommunicationChannel: 'Online',
      batchId: 'BATCH-003',
      policyStatus: 'Expired',
      priority: 'High',
      lastAction: '2025-04-05',
      callCount: 4,
      renewalDate: '2025-04-30',
      failureReason: 'Payment gateway error',
      markedDate: '2025-04-05',
      profile: 'Individual'
    },
    {
      id: 'CASE-RF-002',
      customerName: 'Meera Joshi',
      policyNumber: 'POL-78902',
      status: 'Renewal Failed',
      agent: 'Amit Singh',
      uploadDate: '2025-03-28',
      customerMobile: '9876543214',
      alternateMobile: '9876543266',
      preferredLanguage: 'Marathi',
      productName: 'Health Insurance',
      productCategory: 'Health',
      channel: 'Phone',
      currentCommunicationChannel: 'Phone',
      batchId: 'BATCH-004',
      policyStatus: 'Lapsed',
      priority: 'Medium',
      lastAction: '2025-04-03',
      callCount: 5,
      renewalDate: '2025-05-10',
      failureReason: 'Document verification failed',
      markedDate: '2025-04-03',
      profile: 'Corporate'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setCases(mockRenewalFailedCases);
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const applyAllFilters = (search, date, agent, policyStatus, priority) => {
    let filtered = [...mockRenewalFailedCases];

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
    navigate(`/policy-timeline?customerName=${encodeURIComponent(customerName)}&customerId=${encodeURIComponent(customerId || 'CUST-' + Math.floor(Math.random() * 10000))}&source=renewal-failed`);
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />
          <Typography variant="h4" fontWeight="600">
            Renewal Failed Cases
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
            color="warning"
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
                <TableHead sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
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
                      <TableCell sx={{ textAlign: 'center', width: 80 }}>
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
                                // Call functionality would go here
                                console.log('Call case:', caseItem.id);
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
                                // Quick edit functionality would go here
                                console.log('Quick edit case:', caseItem.id);
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
                                // Add comment functionality would go here
                                console.log('Add comment to case:', caseItem.id);
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
                          color="warning"
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
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Lapsed">Lapsed</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Expiring">Expiring</MenuItem>
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
    </Box>
  );
};

export default RenewalFailedCases;
