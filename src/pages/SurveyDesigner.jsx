import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Alert, useTheme, Fade, IconButton, Tooltip, Avatar,
  Paper, Switch, FormControlLabel, Toolbar, Checkbox, Collapse, Divider,
  Stepper, Step, StepLabel, StepContent, List, ListItem, ListItemText
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon,
  Preview as PreviewIcon, Publish as PublishIcon, ArrowBack as ArrowBackIcon,
  Undo as UndoIcon, Redo as RedoIcon, Palette as PaletteIcon,
  Language as LanguageIcon, Send as SendIcon, Close as CloseIcon,
  Email as EmailIcon, Sms as SmsIcon, WhatsApp as WhatsAppIcon,
  Web as WebIcon, Phone as PhoneIcon, TextFields as TextFieldsIcon,
  CheckBox as CheckBoxIcon, LinearScale as LinearScaleIcon,
  Category as CategoryIcon, Star as StarIcon, AttachFile as AttachFileIcon,
  CalendarToday as CalendarIcon, ContentCopy as ContentCopyIcon,
  ExpandLess, ExpandMore, Visibility as VisibilityIcon,
  Settings as SettingsIcon, Help as HelpIcon, QrCode as QrCodeIcon,
  Link as LinkIcon, GetApp as GetAppIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import feedbackService from '../services/feedbackserver';

const SurveyDesigner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [loaded, setLoaded] = useState(false);

  // Survey Builder State
  const [surveyBuilder, setSurveyBuilder] = useState({
    surveyInfo: {
      title: 'Untitled Survey',
      description: '',
      type: 'custom',
      theme: 'default',
      language: 'en'
    },
    elements: [],
    selectedElement: null,
    previewMode: false,
    currentPage: 1,
    totalPages: 1
  });

  // Dialog states
  const [publishDialog, setPublishDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [helpDialog, setHelpDialog] = useState(false);

  // Sidebar state
  const [expandedCategories, setExpandedCategories] = useState({
    basicInputs: true,
    advancedElements: true,
    brandingElements: true
  });

  // Publish form state
  const [publishForm, setPublishForm] = useState({
    distributionChannels: [],
    targetAudience: '',
    activeDate: '',
    endDate: '',
    generateShortLink: true,
    generateQrCode: true,
    emailSettings: {
      subject: '',
      fromName: '',
      replyTo: ''
    },
    smsSettings: {
      message: ''
    },
    whatsappSettings: {
      message: ''
    }
  });

  useEffect(() => {
    // Load existing survey if surveyId is provided
    if (surveyId) {
      loadSurvey(surveyId);
    }
    setTimeout(() => setLoaded(true), 100);
  }, [surveyId]);

  const loadSurvey = (id) => {
    (async () => {
      try {
        const survey = await feedbackService.getSurvey(id);
        if (survey) {
          setSurveyBuilder(prev => ({
            ...prev,
            surveyInfo: {
              title: survey.title || prev.surveyInfo.title,
              description: survey.description || prev.surveyInfo.description,
              type: survey.type || prev.surveyInfo.type,
              theme: survey.theme || prev.surveyInfo.theme,
              language: survey.language || prev.surveyInfo.language
            },
            elements: survey.elements || [],
            previewMode: false,
            selectedElement: null
          }));
        }
      } catch (e) {
        // ignore - keep mock
      }
    })();
  };

  // Function to toggle category expansion
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Element Library Categories
  const elementLibrary = {
    basicInputs: [
      {
        id: 'text-short',
        type: 'text',
        subtype: 'short',
        icon: <TextFieldsIcon />,
        label: 'Single-line Text',
        description: 'Short answer text field',
        defaultProps: {
          label: 'Your answer',
          placeholder: 'Type your answer here...',
          required: false,
          maxLength: 100
        }
      },
      {
        id: 'text-long',
        type: 'text',
        subtype: 'long',
        icon: <TextFieldsIcon />,
        label: 'Paragraph',
        description: 'Long answer text area',
        defaultProps: {
          label: 'Your detailed answer',
          placeholder: 'Type your detailed answer here...',
          required: false,
          rows: 4,
          maxLength: 1000
        }
      },
      {
        id: 'dropdown',
        type: 'select',
        subtype: 'dropdown',
        icon: <CategoryIcon />,
        label: 'Dropdown',
        description: 'Select from dropdown list',
        defaultProps: {
          label: 'Select an option',
          required: false,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      {
        id: 'multiple-choice',
        type: 'radio',
        subtype: 'single',
        icon: <CheckBoxIcon />,
        label: 'Multiple Choice',
        description: 'Single selection radio buttons',
        defaultProps: {
          label: 'Choose one option',
          required: false,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      {
        id: 'checkboxes',
        type: 'checkbox',
        subtype: 'multiple',
        icon: <CheckBoxIcon />,
        label: 'Checkboxes',
        description: 'Multiple selection checkboxes',
        defaultProps: {
          label: 'Select all that apply',
          required: false,
          options: ['Option 1', 'Option 2', 'Option 3']
        }
      },
      {
        id: 'date-picker',
        type: 'date',
        subtype: 'single',
        icon: <CalendarIcon />,
        label: 'Date Picker',
        description: 'Date selection field',
        defaultProps: {
          label: 'Select date',
          required: false,
          format: 'MM/DD/YYYY'
        }
      },
      {
        id: 'rating-scale',
        type: 'rating',
        subtype: 'stars',
        icon: <StarIcon />,
        label: 'Rating Scale',
        description: '1-5 stars or custom scale',
        defaultProps: {
          label: 'Rate your experience',
          required: false,
          scale: 5,
          type: 'stars'
        }
      },
      {
        id: 'nps-scale',
        type: 'nps',
        subtype: 'scale',
        icon: <LinearScaleIcon />,
        label: 'Net Promoter Score',
        description: '0-10 recommendation scale',
        defaultProps: {
          label: 'How likely are you to recommend us?',
          required: false,
          leftLabel: 'Not at all likely',
          rightLabel: 'Extremely likely'
        }
      }
    ],
    advancedElements: [
      {
        id: 'conditional',
        type: 'conditional',
        subtype: 'logic',
        icon: <CategoryIcon />,
        label: 'Conditional Questions',
        description: 'Show/hide based on answers',
        defaultProps: {
          condition: '',
          showIf: '',
          questions: []
        }
      },
      {
        id: 'section-break',
        type: 'section',
        subtype: 'break',
        icon: <CategoryIcon />,
        label: 'Section Break',
        description: 'Organize into sections',
        defaultProps: {
          title: 'Section Title',
          description: 'Section description'
        }
      },
      {
        id: 'matrix-grid',
        type: 'matrix',
        subtype: 'grid',
        icon: <CategoryIcon />,
        label: 'Matrix / Grid Question',
        description: 'Multiple questions in grid format',
        defaultProps: {
          label: 'Rate the following',
          rows: ['Item 1', 'Item 2', 'Item 3'],
          columns: ['Poor', 'Fair', 'Good', 'Excellent'],
          required: false
        }
      }
    ],
    brandingElements: [
      {
        id: 'heading',
        type: 'heading',
        subtype: 'h1',
        icon: <TextFieldsIcon />,
        label: 'Heading Text',
        description: 'Main heading',
        defaultProps: {
          text: 'Heading Text',
          level: 'h2',
          align: 'left'
        }
      },
      {
        id: 'divider',
        type: 'divider',
        subtype: 'line',
        icon: <CategoryIcon />,
        label: 'Divider Line',
        description: 'Visual separator',
        defaultProps: {
          style: 'solid',
          color: '#e0e0e0',
          thickness: 1
        }
      }
    ]
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, element) => {
    const transferData = {
      id: element.id,
      type: element.type,
      subtype: element.subtype,
      label: element.label,
      description: element.description,
      defaultProps: element.defaultProps
    };
    e.dataTransfer.setData('application/json', JSON.stringify(transferData));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      const newElement = {
        id: `element_${Date.now()}`,
        type: elementData.type,
        subtype: elementData.subtype,
        props: { ...elementData.defaultProps }
      };
      
      setSurveyBuilder(prev => ({
        ...prev,
        elements: [...prev.elements, newElement]
      }));
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  // Element Management
  const handleSelectElement = (elementId) => {
    setSurveyBuilder(prev => ({
      ...prev,
      selectedElement: elementId
    }));
  };

  const handleUpdateElement = (elementId, updates) => {
    setSurveyBuilder(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const handleDeleteElement = (elementId) => {
    setSurveyBuilder(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      selectedElement: prev.selectedElement === elementId ? null : prev.selectedElement
    }));
  };

  const handleDuplicateElement = (elementId) => {
    const element = surveyBuilder.elements.find(el => el.id === elementId);
    if (element) {
      const duplicatedElement = {
        ...element,
        id: `element_${Date.now()}`,
        props: { ...element.props, label: `${element.props.label} (Copy)` }
      };
      setSurveyBuilder(prev => ({
        ...prev,
        elements: [...prev.elements, duplicatedElement]
      }));
    }
  };

  // Survey Actions
  const handleSaveDraft = () => {
    (async () => {
      try {
        const payload = {
          id: surveyId || undefined,
          title: surveyBuilder.surveyInfo.title,
          description: surveyBuilder.surveyInfo.description,
          type: surveyBuilder.surveyInfo.type,
          theme: surveyBuilder.surveyInfo.theme,
          language: surveyBuilder.surveyInfo.language,
          elements: surveyBuilder.elements,
          status: 'draft'
        };
        const saved = await feedbackService.saveSurvey(payload);
        if (saved) {
          // Optionally show a notification or update state
          setSurveyBuilder(prev => ({ ...prev }));
        }
      } catch (e) {
        // ignore for now
      }
    })();
  };

  const handlePreview = () => {
    setSurveyBuilder(prev => ({ ...prev, previewMode: !prev.previewMode }));
  };

  const handlePublish = () => {
    setPublishDialog(true);
  };

  const handleConfirmPublish = () => {
    (async () => {
      try {
        // Ensure survey is saved
        let idToPublish = surveyId || (surveyBuilder.surveyInfo && surveyBuilder.surveyInfo.id);
        if (!idToPublish) {
          const payload = {
            title: surveyBuilder.surveyInfo.title,
            description: surveyBuilder.surveyInfo.description,
            type: surveyBuilder.surveyInfo.type,
            theme: surveyBuilder.surveyInfo.theme,
            language: surveyBuilder.surveyInfo.language,
            elements: surveyBuilder.elements,
            status: 'draft'
          };
          const saved = await feedbackService.saveSurvey(payload);
          idToPublish = saved && saved.id;
        }

        if (idToPublish) {
          const published = await feedbackService.publishSurvey(idToPublish, publishForm);
          if (published) {
            // update local state if needed
            setSurveyBuilder(prev => ({ ...prev }));
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setPublishDialog(false);
      }
    })();
  };

  // Render Element in Canvas
  const renderCanvasElement = (element) => {
    const isSelected = surveyBuilder.selectedElement === element.id;
    
    return (
      <Box
        key={element.id}
        sx={{
          position: 'relative',
          mb: 2,
          p: 2,
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
          borderRadius: 2,
          backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
          cursor: 'pointer',
          '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.02)
          }
        }}
        onClick={() => handleSelectElement(element.id)}
      >
        {/* Element Toolbar */}
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: 0,
              display: 'flex',
              gap: 0.5,
              zIndex: 10
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateElement(element.id);
              }}
              sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteElement(element.id);
              }}
              sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Render Element Based on Type */}
        {element.type === 'text' && (
          <TextField
            fullWidth
            label={element.props.label}
            placeholder={element.props.placeholder}
            multiline={element.subtype === 'long'}
            rows={element.subtype === 'long' ? element.props.rows : 1}
            required={element.props.required}
            disabled
          />
        )}

        {element.type === 'select' && (
          <FormControl fullWidth>
            <InputLabel>{element.props.label}</InputLabel>
            <Select disabled value="">
              {element.props.options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {element.type === 'rating' && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {element.props.label} {element.props.required && '*'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[...Array(element.props.scale)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#e0e0e0' }} />
              ))}
            </Box>
          </Box>
        )}

        {element.type === 'nps' && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {element.props.label} {element.props.required && '*'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption">{element.props.leftLabel}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[...Array(11)].map((_, i) => (
                  <Button
                    key={i}
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{ minWidth: 32, height: 32 }}
                  >
                    {i}
                  </Button>
                ))}
              </Box>
              <Typography variant="caption">{element.props.rightLabel}</Typography>
            </Box>
          </Box>
        )}

        {element.type === 'heading' && (
          <Typography variant={element.props.level} align={element.props.align}>
            {element.props.text}
          </Typography>
        )}

        {element.type === 'divider' && (
          <Divider sx={{ my: 2 }} />
        )}
      </Box>
    );
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Navigation Bar */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 0, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/feedback')}>
                <ArrowBackIcon />
              </IconButton>
              <TextField
                size="small"
                value={surveyBuilder.surveyInfo.title}
                onChange={(e) => setSurveyBuilder(prev => ({
                  ...prev,
                  surveyInfo: { ...prev.surveyInfo, title: e.target.value }
                }))}
                sx={{ minWidth: 250 }}
              />
              <IconButton size="small" title="Undo">
                <UndoIcon />
              </IconButton>
              <IconButton size="small" title="Redo">
                <RedoIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<PaletteIcon />}>
                Theme
              </Button>
              <Button size="small" variant="outlined" startIcon={<LanguageIcon />}>
                Language
              </Button>
              <Button size="small" variant="outlined" onClick={handleSaveDraft} startIcon={<SaveIcon />}>
                Save Draft
              </Button>
              <Button size="small" variant="outlined" onClick={handlePreview} startIcon={<PreviewIcon />}>
                {surveyBuilder.previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button size="small" variant="contained" onClick={handlePublish} startIcon={<PublishIcon />}>
                Publish Survey
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, gap: 2, px: 2 }}>
          {/* Left Sidebar - Element Library */}
          <Paper sx={{ width: 300, p: 2, borderRadius: 2, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Survey Elements
            </Typography>
            
            {/* Basic Input Fields - Collapsible Section */}
            <Box sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                }}
                onClick={() => toggleCategoryExpansion('basicInputs')}
              >
                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                  🔘 Basic Input Fields
                </Typography>
                <IconButton size="small">
                  {expandedCategories.basicInputs ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedCategories.basicInputs} timeout="auto">
                <Box sx={{ mt: 1 }}>
                  {elementLibrary.basicInputs.map((element) => (
                    <Box
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {element.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {element.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {element.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>

            {/* Advanced Elements - Collapsible Section */}
            <Box sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.05) }
                }}
                onClick={() => toggleCategoryExpansion('advancedElements')}
              >
                <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                  🔄 Advanced Elements
                </Typography>
                <IconButton size="small">
                  {expandedCategories.advancedElements ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedCategories.advancedElements} timeout="auto">
                <Box sx={{ mt: 1 }}>
                  {elementLibrary.advancedElements.map((element) => (
                    <Box
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          borderColor: 'warning.main',
                          backgroundColor: alpha(theme.palette.warning.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {element.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {element.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {element.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>

            {/* Branding Elements - Collapsible Section */}
            <Box sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.05) }
                }}
                onClick={() => toggleCategoryExpansion('brandingElements')}
              >
                <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                  🎨 Branding Elements
                </Typography>
                <IconButton size="small">
                  {expandedCategories.brandingElements ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={expandedCategories.brandingElements} timeout="auto">
                <Box sx={{ mt: 1 }}>
                  {elementLibrary.brandingElements.map((element) => (
                    <Box
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          borderColor: 'info.main',
                          backgroundColor: alpha(theme.palette.info.main, 0.05)
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {element.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {element.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {element.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </Paper>

          {/* Center - Form Canvas */}
          <Paper 
            sx={{ 
              flex: 1, 
              p: 3, 
              borderRadius: 2, 
              overflowY: 'auto',
              minHeight: 600
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              {/* Survey Header */}
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  {surveyBuilder.surveyInfo.title}
                </Typography>
                {surveyBuilder.surveyInfo.description && (
                  <Typography variant="body1" color="text.secondary">
                    {surveyBuilder.surveyInfo.description}
                  </Typography>
                )}
              </Box>

              {/* Survey Elements */}
              {surveyBuilder.elements.length === 0 ? (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 6,
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Drag elements here to build your survey
                  </Typography>
                  <Typography variant="body2">
                    Start by dragging question types from the left sidebar
                  </Typography>
                </Box>
              ) : (
                surveyBuilder.elements.map(renderCanvasElement)
              )}
            </Box>
          </Paper>

          {/* Right Panel - Properties */}
          <Paper sx={{ width: 320, borderRadius: 2, overflowY: 'auto', p: 3 }}>
            <Typography variant="h6" gutterBottom>Properties Panel</Typography>
            {surveyBuilder.selectedElement ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Edit properties for selected element
                </Typography>
                {/* Add property editing controls here */}
                <TextField
                  fullWidth
                  label="Element Label"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Required field"
                  sx={{ mb: 2 }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Select an element to edit its properties
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Publish Dialog */}
        <Dialog 
          open={publishDialog} 
          onClose={() => setPublishDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">🚀 Publish Survey</Typography>
              <IconButton onClick={() => setPublishDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Configure your survey distribution settings
              </Typography>
            </Box>

            <Stepper activeStep={0} orientation="vertical">
              <Step>
                <StepLabel>Distribution Channels</StepLabel>
                <StepContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={publishForm.distributionChannels.includes('email')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: [...prev.distributionChannels, 'email']
                              }));
                            } else {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: prev.distributionChannels.filter(c => c !== 'email')
                              }));
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon />
                          Email
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={publishForm.distributionChannels.includes('sms')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: [...prev.distributionChannels, 'sms']
                              }));
                            } else {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: prev.distributionChannels.filter(c => c !== 'sms')
                              }));
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SmsIcon />
                          SMS
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={publishForm.distributionChannels.includes('whatsapp')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: [...prev.distributionChannels, 'whatsapp']
                              }));
                            } else {
                              setPublishForm(prev => ({
                                ...prev,
                                distributionChannels: prev.distributionChannels.filter(c => c !== 'whatsapp')
                              }));
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WhatsAppIcon />
                          WhatsApp
                        </Box>
                      }
                    />
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Survey Settings</StepLabel>
                <StepContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Start Date"
                        value={publishForm.activeDate}
                        onChange={(e) => setPublishForm(prev => ({ ...prev, activeDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="End Date"
                        value={publishForm.endDate}
                        onChange={(e) => setPublishForm(prev => ({ ...prev, endDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={publishForm.generateShortLink}
                            onChange={(e) => setPublishForm(prev => ({ ...prev, generateShortLink: e.target.checked }))}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon />
                            Generate Short Link
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={publishForm.generateQrCode}
                            onChange={(e) => setPublishForm(prev => ({ ...prev, generateQrCode: e.target.checked }))}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QrCodeIcon />
                            Generate QR Code
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
            </Stepper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPublishDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmPublish} startIcon={<PublishIcon />}>
              Publish Survey
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default SurveyDesigner; 