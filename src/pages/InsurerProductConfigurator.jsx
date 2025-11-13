import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Switch, FormControlLabel, Alert, Snackbar,
  Tooltip, Badge, alpha, useTheme, Divider, Stack, InputAdornment,
  FormGroup, Checkbox, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as InsurerIcon,
  Inventory as ProductIcon,
  Settings as SettingsIcon,
  CheckCircle as ConnectedIcon,
  Cancel as DisconnectedIcon,
  Warning as WarningIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  CloudSync as SyncIcon,
  Link as LinkIcon,
  VpnKey as KeyIcon,
  ExpandMore as ExpandMoreIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import { useInsurerProduct } from '../context/InsurerProductContext';

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: value === index ? 24 : 0 }}>
      {value === index && children}
    </div>
  );
}

const InsurerProductConfigurator = () => {
  const theme = useTheme();
  const {
    insurers,
    products,
    loading,
    addInsurer,
    updateInsurer,
    deleteInsurer,
    testInsurerConnection,
    toggleInsurerStatus,
    getInsurerById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    duplicateProduct,
    getProductsByInsurer,
    getStatistics
  } = useInsurerProduct();

  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Insurer Dialog State
  const [insurerDialog, setInsurerDialog] = useState({
    open: false,
    mode: 'add', // 'add' or 'edit'
    data: {
      name: '',
      fullName: '',
      logo: '',
      apiEndpoint: '',
      apiKey: '',
      apiSecret: '',
      supportedProducts: [],
      contactEmail: '',
      contactPhone: '',
      status: 'active',
      settings: {
        autoQuote: true,
        realTimeVerification: true,
        webhookUrl: '',
        timeout: 30,
        retryAttempts: 3
      }
    }
  });

  // Product Dialog State
  const [productDialog, setProductDialog] = useState({
    open: false,
    mode: 'add', // 'add' or 'edit'
    data: {
      name: '',
      insurerId: '',
      category: 'motor',
      subCategory: '',
      status: 'active',
      description: '',
      premiumRules: {
        '3M': { baseRate: 0, minPremium: 0, maxPremium: 0 },
        '6M': { baseRate: 0, minPremium: 0, maxPremium: 0 },
        '12M': { baseRate: 0, minPremium: 0, maxPremium: 0 }
      },
      features: [],
      addOns: []
    }
  });

  const [featureInput, setFeatureInput] = useState('');
  const [addOnInput, setAddOnInput] = useState('');
  const [testingConnection, setTestingConnection] = useState(null);

  const stats = getStatistics();

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Show Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ============ INSURER FUNCTIONS ============

  const handleOpenInsurerDialog = (mode, insurer = null) => {
    if (mode === 'edit' && insurer) {
      setInsurerDialog({
        open: true,
        mode: 'edit',
        data: { ...insurer }
      });
    } else {
      setInsurerDialog({
        open: true,
        mode: 'add',
        data: {
          name: '',
          fullName: '',
          logo: '',
          apiEndpoint: '',
          apiKey: '',
          apiSecret: '',
          supportedProducts: [],
          contactEmail: '',
          contactPhone: '',
          status: 'active',
          settings: {
            autoQuote: true,
            realTimeVerification: true,
            webhookUrl: '',
            timeout: 30,
            retryAttempts: 3
          }
        }
      });
    }
  };

  const handleCloseInsurerDialog = () => {
    setInsurerDialog(prev => ({ ...prev, open: false }));
  };

  const handleInsurerFieldChange = (field, value) => {
    setInsurerDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleInsurerSettingChange = (setting, value) => {
    setInsurerDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        settings: { ...prev.data.settings, [setting]: value }
      }
    }));
  };

  const handleSaveInsurer = () => {
    const { mode, data } = insurerDialog;

    if (!data.name || !data.fullName || !data.apiEndpoint) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    if (mode === 'add') {
      const result = addInsurer(data);
      if (result.success) {
        showSnackbar('Insurer added successfully');
        handleCloseInsurerDialog();
      }
    } else {
      const result = updateInsurer(data.id, data);
      if (result.success) {
        showSnackbar('Insurer updated successfully');
        handleCloseInsurerDialog();
      }
    }
  };

  const handleDeleteInsurer = (insurerId) => {
    if (window.confirm('Are you sure you want to delete this insurer?')) {
      const result = deleteInsurer(insurerId);
      if (result.success) {
        showSnackbar('Insurer deleted successfully');
      } else {
        showSnackbar(result.error, 'error');
      }
    }
  };

  const handleToggleInsurerStatus = (insurerId) => {
    const result = toggleInsurerStatus(insurerId);
    if (result.success) {
      showSnackbar(`Insurer ${result.status === 'active' ? 'activated' : 'deactivated'} successfully`);
    }
  };

  const handleTestConnection = async (insurerId) => {
    setTestingConnection(insurerId);
    const result = await testInsurerConnection(insurerId);
    setTestingConnection(null);

    if (result.success) {
      showSnackbar(result.message);
    } else {
      showSnackbar(result.error, 'error');
    }
  };

  // ============ PRODUCT FUNCTIONS ============

  const handleOpenProductDialog = (mode, product = null) => {
    if (mode === 'edit' && product) {
      setProductDialog({
        open: true,
        mode: 'edit',
        data: { ...product }
      });
    } else {
      setProductDialog({
        open: true,
        mode: 'add',
        data: {
          name: '',
          insurerId: '',
          category: 'motor',
          subCategory: '',
          status: 'active',
          description: '',
          premiumRules: {
            '3M': { baseRate: 0, minPremium: 0, maxPremium: 0 },
            '6M': { baseRate: 0, minPremium: 0, maxPremium: 0 },
            '12M': { baseRate: 0, minPremium: 0, maxPremium: 0 }
          },
          features: [],
          addOns: []
        }
      });
    }
  };

  const handleCloseProductDialog = () => {
    setProductDialog(prev => ({ ...prev, open: false }));
    setFeatureInput('');
    setAddOnInput('');
  };

  const handleProductFieldChange = (field, value) => {
    setProductDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handlePremiumRuleChange = (tenure, field, value) => {
    setProductDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        premiumRules: {
          ...prev.data.premiumRules,
          [tenure]: {
            ...prev.data.premiumRules[tenure],
            [field]: parseFloat(value) || 0
          }
        }
      }
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setProductDialog(prev => ({
        ...prev,
        data: {
          ...prev.data,
          features: [...prev.data.features, featureInput.trim()]
        }
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setProductDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        features: prev.data.features.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddAddOn = () => {
    if (addOnInput.trim()) {
      setProductDialog(prev => ({
        ...prev,
        data: {
          ...prev.data,
          addOns: [...prev.data.addOns, addOnInput.trim()]
        }
      }));
      setAddOnInput('');
    }
  };

  const handleRemoveAddOn = (index) => {
    setProductDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        addOns: prev.data.addOns.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSaveProduct = () => {
    const { mode, data } = productDialog;

    if (!data.name || !data.insurerId || !data.category) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    if (mode === 'add') {
      const result = addProduct(data);
      if (result.success) {
        showSnackbar('Product added successfully');
        handleCloseProductDialog();
      }
    } else {
      const result = updateProduct(data.id, data);
      if (result.success) {
        showSnackbar('Product updated successfully');
        handleCloseProductDialog();
      }
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = deleteProduct(productId);
      if (result.success) {
        showSnackbar('Product deleted successfully');
      }
    }
  };

  const handleToggleProductStatus = (productId) => {
    const result = toggleProductStatus(productId);
    if (result.success) {
      showSnackbar(`Product ${result.status === 'active' ? 'activated' : 'deactivated'} successfully`);
    }
  };

  const handleDuplicateProduct = (productId) => {
    const result = duplicateProduct(productId);
    if (result.success) {
      showSnackbar('Product duplicated successfully');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'testing': return 'warning';
      case 'error': return 'error';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Insurer & Product Configurator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage insurance providers and their product catalog
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Insurers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalInsurers}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stats.activeInsurers} Active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <InsurerIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Connected
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.connectedInsurers}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    API Integration
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <SyncIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stats.activeProducts} Active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <ProductIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Categories
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {Object.keys(stats.productsByCategory).filter(k => stats.productsByCategory[k] > 0).length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Motor, Health, Travel...
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <CategoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<InsurerIcon />} label="Insurers" iconPosition="start" />
          <Tab icon={<ProductIcon />} label="Products" iconPosition="start" />
        </Tabs>

        {/* Insurers Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Insurance Providers ({insurers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenInsurerDialog('add')}
              >
                Add Insurer
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Insurer</TableCell>
                    <TableCell>Integration Status</TableCell>
                    <TableCell>Supported Products</TableCell>
                    <TableCell>Products Count</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insurers.map((insurer) => (
                    <TableRow key={insurer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={insurer.logo} alt={insurer.name}>
                            {insurer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {insurer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {insurer.fullName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={insurer.integrationStatus}
                          color={getStatusColor(insurer.integrationStatus)}
                          icon={insurer.integrationStatus === 'connected' ? <ConnectedIcon /> : <WarningIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {insurer.supportedProducts?.map((prod, idx) => (
                            <Chip key={idx} label={prod} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getProductsByInsurer(insurer.id).length}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={insurer.status === 'active'}
                          onChange={() => handleToggleInsurerStatus(insurer.id)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Test Connection">
                          <IconButton
                            size="small"
                            onClick={() => handleTestConnection(insurer.id)}
                            disabled={testingConnection === insurer.id}
                          >
                            {testingConnection === insurer.id ? <RefreshIcon className="spin" /> : <SyncIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenInsurerDialog('edit', insurer)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteInsurer(insurer.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Product Catalog ({products.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenProductDialog('add')}
              >
                Add Product
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Insurer</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Premium Tenures</TableCell>
                    <TableCell>Features</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => {
                    const insurer = getInsurerById(product.insurerId);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.subCategory}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={insurer?.name || 'Unknown'}
                            size="small"
                            avatar={<Avatar src={insurer?.logo}>{insurer?.name?.charAt(0)}</Avatar>}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={product.category} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {Object.keys(product.premiumRules || {}).map(tenure => (
                              <Chip key={tenure} label={tenure} size="small" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={product.features?.length || 0} size="small" color="info" />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.status === 'active'}
                            onChange={() => handleToggleProductStatus(product.id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Duplicate">
                            <IconButton
                              size="small"
                              onClick={() => handleDuplicateProduct(product.id)}
                            >
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenProductDialog('edit', product)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Insurer Dialog */}
      <Dialog
        open={insurerDialog.open}
        onClose={handleCloseInsurerDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {insurerDialog.mode === 'add' ? 'Add New Insurer' : 'Edit Insurer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Basic Information */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurer Name *"
                  value={insurerDialog.data.name}
                  onChange={(e) => handleInsurerFieldChange('name', e.target.value)}
                  placeholder="e.g., Tata AIG"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Legal Name *"
                  value={insurerDialog.data.fullName}
                  onChange={(e) => handleInsurerFieldChange('fullName', e.target.value)}
                  placeholder="e.g., Tata AIG General Insurance Company Limited"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={insurerDialog.data.contactEmail}
                  onChange={(e) => handleInsurerFieldChange('contactEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={insurerDialog.data.contactPhone}
                  onChange={(e) => handleInsurerFieldChange('contactPhone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={insurerDialog.data.logo}
                  onChange={(e) => handleInsurerFieldChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </Grid>
            </Grid>

            <Divider />

            {/* API Configuration */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              API Configuration
            </Typography>

            <TextField
              fullWidth
              label="API Endpoint *"
              value={insurerDialog.data.apiEndpoint}
              onChange={(e) => handleInsurerFieldChange('apiEndpoint', e.target.value)}
              placeholder="https://api.insurer.com/v1"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                )
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="API Key"
                  value={insurerDialog.data.apiKey}
                  onChange={(e) => handleInsurerFieldChange('apiKey', e.target.value)}
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="API Secret"
                  value={insurerDialog.data.apiSecret}
                  onChange={(e) => handleInsurerFieldChange('apiSecret', e.target.value)}
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Divider />

            {/* Settings */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Integration Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={insurerDialog.data.settings.webhookUrl}
                  onChange={(e) => handleInsurerSettingChange('webhookUrl', e.target.value)}
                  placeholder="https://api.yourapp.com/webhooks/insurer"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Timeout (seconds)"
                  type="number"
                  value={insurerDialog.data.settings.timeout}
                  onChange={(e) => handleInsurerSettingChange('timeout', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Retry Attempts"
                  type="number"
                  value={insurerDialog.data.settings.retryAttempts}
                  onChange={(e) => handleInsurerSettingChange('retryAttempts', parseInt(e.target.value))}
                />
              </Grid>
            </Grid>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={insurerDialog.data.settings.autoQuote}
                    onChange={(e) => handleInsurerSettingChange('autoQuote', e.target.checked)}
                  />
                }
                label="Enable Auto Quote Generation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={insurerDialog.data.settings.realTimeVerification}
                    onChange={(e) => handleInsurerSettingChange('realTimeVerification', e.target.checked)}
                  />
                }
                label="Enable Real-time Verification"
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInsurerDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveInsurer}>
            {insurerDialog.mode === 'add' ? 'Add Insurer' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Dialog */}
      <Dialog
        open={productDialog.open}
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {productDialog.mode === 'add' ? 'Add New Product' : 'Edit Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Basic Information */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Product Name *"
              value={productDialog.data.name}
              onChange={(e) => handleProductFieldChange('name', e.target.value)}
              placeholder="e.g., Comprehensive Motor Insurance"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Insurer *</InputLabel>
                  <Select
                    value={productDialog.data.insurerId}
                    label="Insurer *"
                    onChange={(e) => handleProductFieldChange('insurerId', e.target.value)}
                  >
                    {insurers.filter(i => i.status === 'active').map((insurer) => (
                      <MenuItem key={insurer.id} value={insurer.id}>
                        {insurer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={productDialog.data.category}
                    label="Category *"
                    onChange={(e) => handleProductFieldChange('category', e.target.value)}
                  >
                    <MenuItem value="motor">Motor</MenuItem>
                    <MenuItem value="health">Health</MenuItem>
                    <MenuItem value="travel">Travel</MenuItem>
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="life">Life</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sub Category"
                  value={productDialog.data.subCategory}
                  onChange={(e) => handleProductFieldChange('subCategory', e.target.value)}
                  placeholder="e.g., Four Wheeler, Two Wheeler, Individual, Family"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={productDialog.data.description}
              onChange={(e) => handleProductFieldChange('description', e.target.value)}
            />

            <Divider />

            {/* Premium Rules */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Premium Rules (Tenure-based)
            </Typography>

            {['3M', '6M', '12M'].map((tenure) => (
              <Accordion key={tenure}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{tenure} (3/6/12 Months)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Base Rate"
                        type="number"
                        value={productDialog.data.premiumRules[tenure]?.baseRate || 0}
                        onChange={(e) => handlePremiumRuleChange(tenure, 'baseRate', e.target.value)}
                        InputProps={{ inputProps: { min: 0, step: 0.001 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Min Premium"
                        type="number"
                        value={productDialog.data.premiumRules[tenure]?.minPremium || 0}
                        onChange={(e) => handlePremiumRuleChange(tenure, 'minPremium', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Max Premium"
                        type="number"
                        value={productDialog.data.premiumRules[tenure]?.maxPremium || 0}
                        onChange={(e) => handlePremiumRuleChange(tenure, 'maxPremium', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            <Divider />

            {/* Features */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Features
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Add Feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <Button variant="outlined" onClick={handleAddFeature}>Add</Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productDialog.data.features?.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => handleRemoveFeature(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Divider />

            {/* Add-ons */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              Add-ons
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Add Add-on"
                value={addOnInput}
                onChange={(e) => setAddOnInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAddOn()}
              />
              <Button variant="outlined" onClick={handleAddAddOn}>Add</Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {productDialog.data.addOns?.map((addOn, index) => (
                <Chip
                  key={index}
                  label={addOn}
                  onDelete={() => handleRemoveAddOn(index)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {productDialog.mode === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* CSS for spinning icon */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </Box>
  );
};

export default InsurerProductConfigurator;
