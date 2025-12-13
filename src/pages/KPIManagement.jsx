import React, { useState, useEffect } from 'react';
import kpiService from '../services/kpiService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Pagination,
  useTheme,
  alpha,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Mock KPI data
const mockKPIData = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    manager: 'Robert Johnson',
    department: 'Sales',
    position: 'Sales Executive',
    kpiName: 'Sales Target',
    kpiType: 'Revenue',
    targetValue: 100000,
    currentValue: 85000,
    unit: 'USD',
    period: 'Monthly',
    status: 'On Track',
    progress: 85,
    lastUpdated: '2024-01-15',
    description: 'Monthly sales revenue target',
    weight: 40,
    category: 'Sales Performance',
    trend: 'up',
    previousValue: 78000,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    manager: 'Lisa Anderson',
    department: 'Marketing',
    position: 'Marketing Manager',
    kpiName: 'Lead Generation',
    kpiType: 'Count',
    targetValue: 500,
    currentValue: 420,
    unit: 'Leads',
    period: 'Monthly',
    status: 'On Track',
    progress: 84,
    lastUpdated: '2024-01-15',
    description: 'Number of qualified leads generated',
    weight: 30,
    category: 'Marketing Performance',
    trend: 'up',
    previousValue: 380,
    createdAt: '2024-01-01'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Mike Wilson',
    manager: 'Alex Thompson',
    department: 'IT',
    position: 'Software Developer',
    kpiName: 'Code Quality',
    kpiType: 'Score',
    targetValue: 90,
    currentValue: 88,
    unit: 'Score',
    period: 'Monthly',
    status: 'At Risk',
    progress: 98,
    lastUpdated: '2024-01-15',
    description: 'Code quality score based on reviews',
    weight: 25,
    category: 'Development Quality',
    trend: 'down',
    previousValue: 92,
    createdAt: '2024-01-01'
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    manager: 'Jennifer White',
    department: 'HR',
    position: 'HR Specialist',
    kpiName: 'Employee Satisfaction',
    kpiType: 'Score',
    targetValue: 4.5,
    currentValue: 4.2,
    unit: 'Rating',
    period: 'Quarterly',
    status: 'At Risk',
    progress: 93,
    lastUpdated: '2024-01-15',
    description: 'Employee satisfaction rating',
    weight: 35,
    category: 'HR Performance',
    trend: 'down',
    previousValue: 4.4,
    createdAt: '2024-01-01'
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'David Brown',
    manager: 'Michael Davis',
    department: 'Finance',
    position: 'Accountant',
    kpiName: 'Budget Accuracy',
    kpiType: 'Percentage',
    targetValue: 95,
    currentValue: 97,
    unit: '%',
    period: 'Monthly',
    status: 'Exceeding',
    progress: 102,
    lastUpdated: '2024-01-15',
    description: 'Accuracy of budget forecasts',
    weight: 30,
    category: 'Financial Performance',
    trend: 'up',
    previousValue: 94,
    createdAt: '2024-01-01'
  }
];

const KPIManagement = () => {
  const theme = useTheme();
  const [kpiData, setKpiData] = useState(mockKPIData);
  const [filteredData, setFilteredData] = useState(mockKPIData);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [editingKPI, setEditingKPI] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    manager: '',
    department: '',
    position: '',
    kpiName: '',
    kpiType: 'Revenue',
    targetValue: '',
    currentValue: '',
    unit: '',
    period: 'Monthly',
    description: '',
    weight: 30,
    category: ''
  });

  // Mock employees
  const employees = [
    { id: 'EMP001', name: 'John Smith', manager: 'Robert Johnson', department: 'Sales', position: 'Sales Executive' },
    { id: 'EMP002', name: 'Sarah Johnson', manager: 'Lisa Anderson', department: 'Marketing', position: 'Marketing Manager' },
    { id: 'EMP003', name: 'Mike Wilson', manager: 'Alex Thompson', department: 'IT', position: 'Software Developer' },
    { id: 'EMP004', name: 'Emily Davis', manager: 'Jennifer White', department: 'HR', position: 'HR Specialist' },
    { id: 'EMP005', name: 'David Brown', manager: 'Michael Davis', department: 'Finance', position: 'Accountant' }
  ];

  const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];
  const kpiTypes = ['Revenue', 'Count', 'Score', 'Percentage', 'Time', 'Quality'];
  const periods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  const categories = ['Sales Performance', 'Marketing Performance', 'Development Quality', 'HR Performance', 'Financial Performance', 'Customer Service'];
  const statusOptions = ['On Track', 'At Risk', 'Exceeding', 'Underperforming'];

  // Load KPIs from service
  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      const data = await kpiService.getKPIs();
      setKpiData(Array.isArray(data) ? data : mockKPIData);
    } catch (error) {
      console.error('Error loading KPIs:', error);
      setKpiData(mockKPIData);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  useEffect(() => {
    if (!Array.isArray(kpiData)) return;

    let filtered = kpiData;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.kpiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    if (departmentFilter !== 'All') {
      filtered = filtered.filter(record => record.department === departmentFilter);
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(record => record.category === categoryFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [kpiData, searchTerm, statusFilter, departmentFilter, categoryFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate KPI statistics
  const kpiStats = {
    totalKPIs: kpiData.length,
    onTrack: kpiData.filter(record => record.status === 'On Track').length,
    atRisk: kpiData.filter(record => record.status === 'At Risk').length,
    exceeding: kpiData.filter(record => record.status === 'Exceeding').length,
    averageProgress: kpiData.length > 0 ? kpiData.reduce((sum, record) => sum + record.progress, 0) / kpiData.length : 0
  };

  // Handle dialog operations
  const handleOpenDialog = (kpi = null, isViewMode = false) => {
    setViewMode(isViewMode);
    if (kpi) {
      setSelectedKPI(kpi);
      setEditingKPI(kpi);
      setFormData({
        employeeId: kpi.employeeId,
        employeeName: kpi.employeeName,
        manager: kpi.manager,
        department: kpi.department,
        position: kpi.position,
        kpiName: kpi.kpiName,
        kpiType: kpi.kpiType,
        targetValue: kpi.targetValue,
        currentValue: kpi.currentValue,
        unit: kpi.unit,
        period: kpi.period,
        description: kpi.description,
        weight: kpi.weight,
        category: kpi.category
      });
    } else {
      setSelectedKPI(null);
      setEditingKPI(null);
      setFormData({
        employeeId: '',
        employeeName: '',
        manager: '',
        department: '',
        position: '',
        kpiName: '',
        kpiType: 'Revenue',
        targetValue: '',
        currentValue: '',
        unit: '',
        period: 'Monthly',
        description: '',
        weight: 30,
        category: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedKPI(null);
    setEditingKPI(null);
    setViewMode(false);
  };

  const handleSaveKPI = () => {
    setLoading(true);

    setTimeout(() => {
      if (editingKPI) {
        const updatedData = kpiData.map(record =>
          record.id === editingKPI.id
            ? {
              ...record,
              ...formData,
              progress: Math.round((formData.currentValue / formData.targetValue) * 100),
              status: calculateStatus(formData.currentValue, formData.targetValue),
              lastUpdated: new Date().toISOString().split('T')[0]
            }
            : record
        );
        setKpiData(updatedData);
        setSnackbar({ open: true, message: 'KPI updated successfully!', severity: 'success' });
      } else {
        const newKPI = {
          id: Math.max(...kpiData.map(r => r.id)) + 1,
          ...formData,
          progress: Math.round((formData.currentValue / formData.targetValue) * 100),
          status: calculateStatus(formData.currentValue, formData.targetValue),
          lastUpdated: new Date().toISOString().split('T')[0],
          trend: 'up',
          previousValue: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setKpiData([...kpiData, newKPI]);
        setSnackbar({ open: true, message: 'KPI added successfully!', severity: 'success' });
      }

      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  const calculateStatus = (current, target) => {
    const progress = (current / target) * 100;
    if (progress >= 100) return 'Exceeding';
    if (progress >= 80) return 'On Track';
    if (progress >= 60) return 'At Risk';
    return 'Underperforming';
  };

  const getStatusColor = (status) => {
    const colors = {
      'On Track': theme.palette.success.main,
      'At Risk': theme.palette.warning.main,
      'Exceeding': theme.palette.info.main,
      'Underperforming': theme.palette.error.main
    };
    return colors[status] || theme.palette.grey[500];
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 80) return 'primary';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setFormData({
        ...formData,
        employeeId: employee.id,
        employeeName: employee.name,
        manager: employee.manager,
        department: employee.department,
        position: employee.position
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary">
          KPI Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null, false)}
        >
          Add KPI
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {kpiStats.totalKPIs}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total KPIs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {kpiStats.onTrack}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                On Track
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {kpiStats.atRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                At Risk
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="info.main">
                {kpiStats.exceeding}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exceeding
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="secondary.main">
                {kpiStats.averageProgress.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="healthcare-card" sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="All KPIs" />
            <Tab label="Performance Dashboard" />
            <Tab label="Reports" />
          </Tabs>
        </Box>
      </Card>

      <Card className="healthcare-card" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search KPIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setDepartmentFilter('All');
                  setCategoryFilter('All');
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className="healthcare-card">
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>KPI Name</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Current</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {record.employeeName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.department} • {record.position}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="600">
                        {record.manager}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="600">
                        {record.kpiName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.kpiType} • {record.period}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {record.targetValue.toLocaleString()} {record.unit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="600">
                          {record.currentValue.toLocaleString()} {record.unit}
                        </Typography>
                        {record.trend === 'up' && (
                          <TrendingUpIcon sx={{ ml: 1, color: 'success.main', fontSize: 16 }} />
                        )}
                        {record.trend === 'down' && (
                          <TrendingDownIcon sx={{ ml: 1, color: 'error.main', fontSize: 16 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(record.progress, 100)}
                            color={getProgressColor(record.progress)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="600" sx={{ minWidth: 35 }}>
                          {record.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(record.status), 0.1),
                          color: getStatusColor(record.status),
                          border: `1px solid ${alpha(getStatusColor(record.status), 0.3)}`
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(record.lastUpdated).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleOpenDialog(record, true)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit KPI">
                          <IconButton size="small" onClick={() => handleOpenDialog(record, false)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode ? 'View KPI Details' : (editingKPI ? 'Edit KPI' : 'Add New KPI')}
        </DialogTitle>
        <DialogContent>
          {viewMode && selectedKPI ? (
            <Box sx={{ mt: 2 }}>
              {/* Header Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 3,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '1.5rem'
                  }}
                >
                  {selectedKPI.employeeName.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    {selectedKPI.employeeName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedKPI.position} • {selectedKPI.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manager: {selectedKPI.manager}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={selectedKPI.status}
                    sx={{
                      bgcolor: alpha(getStatusColor(selectedKPI.status), 0.1),
                      color: getStatusColor(selectedKPI.status),
                      borderColor: alpha(getStatusColor(selectedKPI.status), 0.3),
                      borderWidth: 1,
                      borderStyle: 'solid',
                      fontWeight: 600,
                      px: 1
                    }}
                  />
                </Box>
              </Box>

              {/* KPI Stats Section */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {selectedKPI.kpiName} Progress
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h3" fontWeight="600" color="primary">
                          {selectedKPI.progress}%
                        </Typography>
                        <Box sx={{ ml: 2, flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(selectedKPI.progress, 100)}
                            color={getProgressColor(selectedKPI.progress)}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Box>
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Current Value</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6">
                              {selectedKPI.currentValue.toLocaleString()} {selectedKPI.unit}
                            </Typography>
                            {selectedKPI.trend === 'up' && <TrendingUpIcon color="success" sx={{ ml: 1 }} />}
                            {selectedKPI.trend === 'down' && <TrendingDownIcon color="error" sx={{ ml: 1 }} />}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Target Value</Typography>
                          <Typography variant="h6">
                            {selectedKPI.targetValue.toLocaleString()} {selectedKPI.unit}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Details Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">KPI Type</Typography>
                    <Typography variant="subtitle1" fontWeight="500">{selectedKPI.kpiType}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Evaluation Period</Typography>
                    <Typography variant="subtitle1" fontWeight="500">{selectedKPI.period}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Typography variant="subtitle1" fontWeight="500">{selectedKPI.category}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">Weightage</Typography>
                    <Typography variant="subtitle1" fontWeight="500">{selectedKPI.weight}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>{selectedKPI.description}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Last Updated: {new Date(selectedKPI.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={formData.employeeId}
                    label="Employee"
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                  >
                    {employees.map(employee => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.department})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="KPI Name"
                  value={formData.kpiName}
                  onChange={(e) => setFormData({ ...formData, kpiName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>KPI Type</InputLabel>
                  <Select
                    value={formData.kpiType}
                    label="KPI Type"
                    onChange={(e) => setFormData({ ...formData, kpiType: e.target.value })}
                  >
                    {kpiTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={formData.period}
                    label="Period"
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  >
                    {periods.map(period => (
                      <MenuItem key={period} value={period}>{period}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Value"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Value"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., USD, %, Count, Hours"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (%)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this KPI measures and how it's calculated..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>        <DialogActions>
          <Button onClick={handleCloseDialog}>{viewMode ? 'Close' : 'Cancel'}</Button>
          {!viewMode && (
            <Button
              onClick={handleSaveKPI}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : (editingKPI ? 'Update' : 'Save')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

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

export default KPIManagement;