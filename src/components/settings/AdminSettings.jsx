import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button,
  Divider, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Chip, Tabs, Tab, alpha, useTheme, Checkbox, FormControlLabel, Fade, Grow
} from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  getIndustries,
  industryConfig,
  getIndustrySubdivisions,
  getProductStructure,
  usesTabbedForm,
  getAllFieldsFromTabs
} from '../../config/industryConfig';
import * as MuiIcons from '@mui/icons-material';

// Sub-tab panel component
function SubTabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminSettings = () => {
  const theme = useTheme();
  const [subTabValue, setSubTabValue] = useState(0);

  // Company details state - simulate fetching from localStorage/API
  const [companyData, setCompanyData] = useState({
    companyName: 'Veriright Management Solutions Pvt Ltd',
    email: 'admin@veriright.com',
    firstName: 'Admin',
    lastName: 'User',
    numberOfUsers: 50,
    industry: 'insurance',
    registrationDate: '2025-01-15',
    additionalFields: {
      policyType: 'Life',
      coverageAmount: '1000000',
      renewalCycle: 'Annually'
    }
  });

  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editedCompanyData, setEditedCompanyData] = useState({...companyData});
  const [industryChangeDialog, setIndustryChangeDialog] = useState(false);
  const [newIndustry, setNewIndustry] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Industry subdivisions state
  const [subdivisionConfig, setSubdivisionConfig] = useState({});

  // Products state
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState({ open: false, mode: 'add', product: null });
  const [productFormData, setProductFormData] = useState({});
  const [productFormTabValue, setProductFormTabValue] = useState(0); // For tabbed product forms

  const industries = getIndustries();

  // Load subdivision config and products based on industry
  useEffect(() => {
    // Load saved subdivision config from localStorage
    const savedConfig = localStorage.getItem(`subdivisionConfig_${companyData.industry}`);
    if (savedConfig) {
      setSubdivisionConfig(JSON.parse(savedConfig));
    } else {
      // Set default empty config
      const subdivisions = getIndustrySubdivisions(companyData.industry);
      const defaultConfig = {};
      Object.keys(subdivisions).forEach(key => {
        defaultConfig[key] = '';
      });
      setSubdivisionConfig(defaultConfig);
    }

    // Load products from localStorage
    const savedProducts = localStorage.getItem(`products_${companyData.industry}`);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts([]);
    }
  }, [companyData.industry]);

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
  };

  // Company details handlers
  const handleEditCompany = () => {
    setEditedCompanyData({...companyData});
    setIsEditingCompany(true);
  };

  const handleCancelEditCompany = () => {
    setIsEditingCompany(false);
    setEditedCompanyData({...companyData});
  };

  const handleSaveCompanyDetails = () => {
    // Save to localStorage/API
    localStorage.setItem('companyData', JSON.stringify(editedCompanyData));
    setCompanyData(editedCompanyData);
    setIsEditingCompany(false);
    showSuccessMessage('Company details updated successfully');
  };

  const handleCompanyFieldChange = (field, value) => {
    setEditedCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Industry change handlers
  const handleChangeIndustryClick = () => {
    setNewIndustry(companyData.industry);
    setIndustryChangeDialog(true);
  };

  const handleConfirmIndustryChange = () => {
    if (newIndustry && newIndustry !== companyData.industry) {
      // Update company data with new industry
      const updatedData = {
        ...companyData,
        industry: newIndustry,
        additionalFields: {} // Reset additional fields for new industry
      };
      setCompanyData(updatedData);
      localStorage.setItem('companyData', JSON.stringify(updatedData));

      // Reset subdivision config
      const subdivisions = getIndustrySubdivisions(newIndustry);
      const newConfig = {};
      Object.keys(subdivisions).forEach(key => {
        newConfig[key] = '';
      });
      setSubdivisionConfig(newConfig);
      localStorage.removeItem(`subdivisionConfig_${companyData.industry}`);

      // Clear products
      setProducts([]);
      localStorage.removeItem(`products_${companyData.industry}`);

      showSuccessMessage(`Industry changed to ${industryConfig[newIndustry]?.name} successfully. Please update your subdivision configuration and products.`);
    }
    setIndustryChangeDialog(false);
  };

  // Subdivision config handlers
  const handleSubdivisionChange = (key, value) => {
    setSubdivisionConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSubdivisionConfig = () => {
    localStorage.setItem(`subdivisionConfig_${companyData.industry}`, JSON.stringify(subdivisionConfig));
    showSuccessMessage('Subdivision configuration saved successfully');
  };

  // Product handlers
  const handleAddProduct = () => {
    const structure = getProductStructure(companyData.industry);
    const initialData = {};

    // Handle both tabbed and non-tabbed forms
    const fields = usesTabbedForm(companyData.industry)
      ? getAllFieldsFromTabs(companyData.industry)
      : structure.fields;

    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else if (field.type === 'number' || field.type === 'date') {
        initialData[field.name] = '';
      } else {
        initialData[field.name] = '';
      }
    });
    setProductFormData(initialData);
    setProductFormTabValue(0); // Reset to first tab
    setProductDialog({ open: true, mode: 'add', product: null });
  };

  const handleEditProduct = (product) => {
    setProductFormData({...product});
    setProductFormTabValue(0); // Reset to first tab
    setProductDialog({ open: true, mode: 'edit', product });
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem(`products_${companyData.industry}`, JSON.stringify(updatedProducts));
    showSuccessMessage('Product deleted successfully');
  };

  const handleProductFormChange = (field, value) => {
    setProductFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProduct = () => {
    // Validate required fields
    const structure = getProductStructure(companyData.industry);
    const fields = usesTabbedForm(companyData.industry)
      ? getAllFieldsFromTabs(companyData.industry)
      : structure.fields;
    const requiredFields = fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !productFormData[f.name] || productFormData[f.name] === '');

    if (missingFields.length > 0) {
      showErrorMessage(`Please fill all required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (productDialog.mode === 'add') {
      const newProduct = {
        ...productFormData,
        id: `PROD-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem(`products_${companyData.industry}`, JSON.stringify(updatedProducts));
      showSuccessMessage('Product added successfully');
    } else {
      const updatedProducts = products.map(p =>
        p.id === productDialog.product.id ? { ...productFormData, id: p.id, createdAt: p.createdAt, updatedAt: new Date().toISOString() } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(`products_${companyData.industry}`, JSON.stringify(updatedProducts));
      showSuccessMessage('Product updated successfully');
    }

    setProductDialog({ open: false, mode: 'add', product: null });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const renderProductFormField = (field) => {
    if (field.type === 'select') {
      return (
        <FormControl fullWidth size="small">
          <InputLabel>{field.label} {field.required && '*'}</InputLabel>
          <Select
            value={productFormData[field.name] || ''}
            onChange={(e) => handleProductFormChange(field.name, e.target.value)}
            label={`${field.label} ${field.required ? '*' : ''}`}
          >
            {field.options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    } else if (field.type === 'checkbox') {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={productFormData[field.name] || false}
              onChange={(e) => handleProductFormChange(field.name, e.target.checked)}
              color="primary"
            />
          }
          label={field.label}
        />
      );
    } else if (field.type === 'textarea') {
      return (
        <TextField
          fullWidth
          size="small"
          label={field.label}
          multiline
          rows={3}
          value={productFormData[field.name] || ''}
          onChange={(e) => handleProductFormChange(field.name, e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
        />
      );
    } else if (field.type === 'date') {
      return (
        <TextField
          fullWidth
          size="small"
          label={field.label}
          type="date"
          value={productFormData[field.name] || ''}
          onChange={(e) => handleProductFormChange(field.name, e.target.value)}
          required={field.required}
          InputLabelProps={{ shrink: true }}
        />
      );
    } else {
      // text, number, etc.
      const inputProps = {};
      if (field.type === 'number') {
        inputProps.min = 0;
        inputProps.step = field.step || (field.name.includes('price') || field.name.includes('amount') || field.name.includes('fee') || field.name.includes('cost') ? 0.01 : 1);
      }

      return (
        <TextField
          fullWidth
          size="small"
          label={field.label}
          type={field.type || 'text'}
          value={productFormData[field.name] || ''}
          onChange={(e) => handleProductFormChange(field.name, e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          inputProps={inputProps}
        />
      );
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Admin Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your company details, industry configuration, and product catalog
      </Typography>

      {successMessage && (
        <Grow in={Boolean(successMessage)}>
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Grow>
      )}

      {errorMessage && (
        <Grow in={Boolean(errorMessage)}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        </Grow>
      )}

      {/* Sub-tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={subTabValue} onChange={handleSubTabChange}>
          <Tab icon={<BusinessIcon />} label="Company Details" iconPosition="start" />
          <Tab icon={<SettingsIcon />} label="Industry Configuration" iconPosition="start" />
          <Tab icon={<InventoryIcon />} label="Product Management" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Company Details Tab */}
      <SubTabPanel value={subTabValue} index={0}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="600">
                Company Information
              </Typography>
              {!isEditingCompany ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditCompany}
                >
                  Edit
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEditCompany}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveCompanyDetails}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={isEditingCompany ? editedCompanyData.companyName : companyData.companyName}
                  onChange={(e) => handleCompanyFieldChange('companyName', e.target.value)}
                  disabled={!isEditingCompany}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={isEditingCompany ? editedCompanyData.email : companyData.email}
                  onChange={(e) => handleCompanyFieldChange('email', e.target.value)}
                  disabled={!isEditingCompany}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={isEditingCompany ? editedCompanyData.firstName : companyData.firstName}
                  onChange={(e) => handleCompanyFieldChange('firstName', e.target.value)}
                  disabled={!isEditingCompany}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={isEditingCompany ? editedCompanyData.lastName : companyData.lastName}
                  onChange={(e) => handleCompanyFieldChange('lastName', e.target.value)}
                  disabled={!isEditingCompany}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Users"
                  type="number"
                  value={isEditingCompany ? editedCompanyData.numberOfUsers : companyData.numberOfUsers}
                  onChange={(e) => handleCompanyFieldChange('numberOfUsers', parseInt(e.target.value))}
                  disabled={!isEditingCompany}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Registration Date"
                  value={new Date(companyData.registrationDate).toLocaleDateString()}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Current Industry
                  </Typography>
                  <Chip
                    icon={<CategoryIcon />}
                    label={industryConfig[companyData.industry]?.name || 'Unknown'}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  onClick={handleChangeIndustryClick}
                  fullWidth
                  sx={{ height: '100%' }}
                >
                  Change Industry
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SubTabPanel>

      {/* Industry Configuration Tab */}
      <SubTabPanel value={subTabValue} index={1}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {industryConfig[companyData.industry]?.name} Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure industry-specific subdivisions and settings for your business
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {Object.entries(getIndustrySubdivisions(companyData.industry)).map(([key, config]) => (
                <Grid item xs={12} md={6} key={key}>
                  <FormControl fullWidth>
                    <InputLabel>{config.label}</InputLabel>
                    <Select
                      value={subdivisionConfig[key] || ''}
                      onChange={(e) => handleSubdivisionChange(key, e.target.value)}
                      label={config.label}
                    >
                      {config.options.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSubdivisionConfig}
              >
                Save Configuration
              </Button>
            </Box>
          </CardContent>
        </Card>
      </SubTabPanel>

      {/* Product Management Tab */}
      <SubTabPanel value={subTabValue} index={2}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {industryConfig[companyData.industry]?.terminology?.product || 'Product'} Catalog
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your {industryConfig[companyData.industry]?.terminology?.products?.toLowerCase() || 'products'} and services
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
              >
                Add {industryConfig[companyData.industry]?.terminology?.product || 'Product'}
              </Button>
            </Box>

            {products.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {industryConfig[companyData.industry]?.terminology?.products?.toLowerCase() || 'products'} yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add your first {industryConfig[companyData.industry]?.terminology?.product?.toLowerCase() || 'product'} to get started
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      {(() => {
                        const structure = getProductStructure(companyData.industry);
                        const displayFields = usesTabbedForm(companyData.industry)
                          ? getAllFieldsFromTabs(companyData.industry).slice(0, 4)
                          : structure.fields.slice(0, 4);
                        return displayFields.map((field) => (
                          <TableCell key={field.name} sx={{ fontWeight: 600 }}>
                            {field.label}
                          </TableCell>
                        ));
                      })()}
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} hover>
                        {(() => {
                          const structure = getProductStructure(companyData.industry);
                          const displayFields = usesTabbedForm(companyData.industry)
                            ? getAllFieldsFromTabs(companyData.industry).slice(0, 4)
                            : structure.fields.slice(0, 4);
                          return displayFields.map((field) => (
                            <TableCell key={field.name}>
                              {field.type === 'checkbox'
                                ? (product[field.name] ? 'Yes' : 'No')
                                : product[field.name] || '-'
                              }
                            </TableCell>
                          ));
                        })()}
                        <TableCell>
                          <Chip
                            label={product.isActive !== false ? 'Active' : 'Inactive'}
                            color={product.isActive !== false ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEditProduct(product)}
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProduct(product.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </SubTabPanel>

      {/* Industry Change Confirmation Dialog */}
      <Dialog
        open={industryChangeDialog}
        onClose={() => setIndustryChangeDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Change Industry
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Changing your industry will reset your subdivision configuration and product catalog. This action cannot be undone.
          </Alert>
          <FormControl fullWidth>
            <InputLabel>Select New Industry</InputLabel>
            <Select
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              label="Select New Industry"
            >
              {industries.map((industry) => (
                <MenuItem key={industry.value} value={industry.value}>
                  {industry.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIndustryChangeDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmIndustryChange}
            variant="contained"
            disabled={!newIndustry || newIndustry === companyData.industry}
          >
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Add/Edit Dialog */}
      <Dialog
        open={productDialog.open}
        onClose={() => setProductDialog({ open: false, mode: 'add', product: null })}
        maxWidth={usesTabbedForm(companyData.industry) ? "lg" : "md"}
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          {productDialog.mode === 'add' ? 'Add New' : 'Edit'} {industryConfig[companyData.industry]?.terminology?.product || 'Product'}
        </DialogTitle>
        <DialogContent>
          {usesTabbedForm(companyData.industry) ? (
            // Render tabbed form
            <Box sx={{ mt: 1 }}>
              <Tabs
                value={productFormTabValue}
                onChange={(e, newValue) => setProductFormTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  mb: 3,
                  '& .MuiTab-root': {
                    minHeight: 56,
                    textTransform: 'none'
                  }
                }}
              >
                {getProductStructure(companyData.industry).tabs.map((tab, index) => {
                  // Get the icon component
                  const IconComponent = MuiIcons[
                    tab.icon.charAt(0).toUpperCase() +
                    tab.icon.slice(1).replace(/_([a-z])/g, (g) => g[1].toUpperCase())
                  ] || MuiIcons.Info;

                  return (
                    <Tab
                      key={tab.id}
                      label={tab.label}
                      icon={<IconComponent />}
                      iconPosition="start"
                      sx={{ gap: 1 }}
                    />
                  );
                })}
              </Tabs>

              {getProductStructure(companyData.industry).tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  role="tabpanel"
                  hidden={productFormTabValue !== index}
                >
                  {productFormTabValue === index && (
                    <Grid container spacing={2}>
                      {tab.fields.map((field) => (
                        <Grid item xs={12} md={field.type === 'textarea' ? 12 : 6} key={field.name}>
                          {renderProductFormField(field)}
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              ))}
            </Box>
          ) : (
            // Render simple form
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {getProductStructure(companyData.industry).fields.map((field) => (
                <Grid item xs={12} md={field.type === 'textarea' ? 12 : 6} key={field.name}>
                  {renderProductFormField(field)}
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setProductDialog({ open: false, mode: 'add', product: null })}
            color="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {productDialog.mode === 'add' ? 'Add' : 'Update'} {industryConfig[companyData.industry]?.terminology?.product || 'Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;
