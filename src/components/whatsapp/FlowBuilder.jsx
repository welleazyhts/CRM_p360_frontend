import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid, Card, CardContent,
  IconButton, Avatar, Divider, List, ListItem, ListItemText, 
  ListItemIcon, Dialog, TextField, FormControl, InputLabel, 
  Select, MenuItem, Switch, FormControlLabel, AppBar, Toolbar,
  useTheme, Tabs, Tab, Chip, Alert, Accordion, AccordionSummary,
  AccordionDetails, ListItemSecondaryAction, Slider, RadioGroup,
  Radio, FormLabel, Checkbox, ListItemButton, Tooltip, Badge,
  Stepper, Step, StepLabel, StepContent, Fab, Menu, MenuItem as MenuItemComponent
} from '@mui/material';
import {
  Add as AddIcon,
  Message as MessageIcon,
  Input as InputIcon,
  SmartButton as ButtonIcon,
  ViewCarousel as CarouselIcon,
  Api as ApiIcon,
  AccountTree as ConditionalIcon,
  SupportAgent as HandoverIcon,
  Description as TemplateIcon,
  Timeline as FlowIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  BugReport as DebugIcon,
  Analytics as AnalyticsIcon,
  Publish as PublishIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Phone as PhoneIcon,
  Smartphone as SmartphoneIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Accessibility as AccessibilityIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  NotificationImportant as NotificationIcon
} from '@mui/icons-material';

const FlowBuilder = ({ open, onClose, flow, onSave }) => {
  const theme = useTheme();
  const [flowData, setFlowData] = useState(flow || {
    id: null,
    name: '',
    description: '',
    entryPoint: 'inbound_message',
    blocks: [],
    variables: [],
    connections: [],
    templates: [],
    version: 1,
    status: 'draft',
    analytics: {
      totalRuns: 0,
      completionRate: 0,
      dropOffPoints: [],
      avgResponseTime: 0
    }
  });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [testMode, setTestMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [connectionMode, setConnectionMode] = useState(false);
  const [sourceBlock, setSourceBlock] = useState(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  const actionBlocks = [
    {
      id: 'send_message',
      name: 'Send Message',
      icon: <MessageIcon />,
      color: 'primary',
      description: 'Send a text message to the user',
      category: 'messaging',
      outputs: ['success', 'failed']
    },
    {
      id: 'collect_input',
      name: 'Collect Input',
      icon: <InputIcon />,
      color: 'secondary',
      description: 'Collect text input from user',
      category: 'input',
      outputs: ['valid', 'invalid', 'timeout']
    },
    {
      id: 'buttons',
      name: 'Buttons',
      icon: <ButtonIcon />,
      color: 'info',
      description: 'Show interactive buttons',
      category: 'interactive',
      outputs: ['button_1', 'button_2', 'button_3', 'timeout']
    },
    {
      id: 'carousel',
      name: 'Carousel',
      icon: <CarouselIcon />,
      color: 'warning',
      description: 'Display carousel of cards',
      category: 'interactive',
      outputs: ['card_selected', 'no_selection', 'timeout']
    },
    {
      id: 'api_call',
      name: 'API Call',
      icon: <ApiIcon />,
      color: 'error',
      description: 'Make external API request',
      category: 'integration',
      outputs: ['success', 'error', 'timeout']
    },
    {
      id: 'conditional',
      name: 'Conditional Logic',
      icon: <ConditionalIcon />,
      color: 'success',
      description: 'Branch flow based on conditions',
      category: 'logic',
      outputs: ['true', 'false', 'error']
    },
    {
      id: 'handover',
      name: 'Human Handover',
      icon: <HandoverIcon />,
      color: 'default',
      description: 'Transfer to human agent',
      category: 'support',
      outputs: ['transferred', 'no_agents', 'failed']
    },
    {
      id: 'template',
      name: 'Template',
      icon: <TemplateIcon />,
      color: 'primary',
      description: 'Use WhatsApp template',
      category: 'messaging',
      outputs: ['sent', 'failed', 'rejected']
    },
    {
      id: 'whatsapp_flow',
      name: 'WhatsApp Flow',
      icon: <FlowIcon />,
      color: 'secondary',
      description: 'Launch structured template flow',
      category: 'advanced',
      outputs: ['completed', 'abandoned', 'error']
    }
  ];

  const entryPoints = [
    { value: 'inbound_message', label: 'Inbound Message Trigger' },
    { value: 'campaign_followup', label: 'Post-Campaign Follow-up' },
    { value: 'webhook', label: 'Webhook Trigger' },
    { value: 'scheduled', label: 'Scheduled Trigger' },
    { value: 'api', label: 'API Trigger' }
  ];

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedBlock) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBlock = {
      id: `${draggedBlock.id}_${Date.now()}`,
      type: draggedBlock.id,
      name: draggedBlock.name,
      position: { x, y },
      config: getDefaultConfig(draggedBlock.id),
      connections: []
    };

    setFlowData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));

    setDraggedBlock(null);
  };

  const getDefaultConfig = (blockType) => {
    const configs = {
      send_message: {
        message: 'Hello! How can I help you today?',
        delay: 0,
        variables: [],
        formatting: 'plain',
        attachments: []
      },
      collect_input: {
        prompt: 'Please enter your response:',
        variable: 'user_input',
        validation: 'none',
        required: true,
        timeout: 300,
        retryMessage: 'Please provide a valid response.',
        maxRetries: 3
      },
      buttons: {
        message: 'Please choose an option:',
        buttons: [
          { id: 'btn1', text: 'Option 1', value: 'option1' },
          { id: 'btn2', text: 'Option 2', value: 'option2' }
        ],
        timeout: 300,
        fallbackMessage: 'Please select one of the options above.'
      },
      carousel: {
        title: 'Choose from our options',
        cards: [
          {
            id: 'card1',
            title: 'Option 1',
            subtitle: 'Description for option 1',
            imageUrl: '',
            buttons: [{ text: 'Select', value: 'option1' }]
          }
        ],
        timeout: 300
      },
      api_call: {
        url: '',
        method: 'GET',
        headers: {},
        body: '',
        timeout: 30,
        retries: 3,
        responseVariable: 'api_response',
        errorHandling: 'continue'
      },
      conditional: {
        conditions: [
          {
            variable: '',
            operator: 'equals',
            value: '',
            output: 'true'
          }
        ],
        defaultOutput: 'false'
      },
      handover: {
        department: 'general',
        priority: 'normal',
        message: 'Transferring you to a human agent...',
        timeout: 600,
        fallbackMessage: 'All agents are busy. Please try again later.'
      },
      template: {
        templateId: '',
        templateName: '',
        language: 'en',
        parameters: [],
        fallbackMessage: 'Template message could not be sent.'
      },
      whatsapp_flow: {
        flowId: '',
        flowName: '',
        screens: [],
        variables: {},
        completion: 'continue'
      }
    };
    return configs[blockType] || {};
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
  };

  const handleBlockUpdate = (blockId, config) => {
    setFlowData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, config } : block
      )
    }));
  };

  const handleSave = () => {
    const updatedFlow = {
      ...flowData,
      lastModified: new Date().toISOString(),
      version: flowData.version + 1
    };
    onSave(updatedFlow);
    addDebugLog('Flow saved successfully', 'success');
  };

  const handleConnect = (sourceBlockId, targetBlockId, output = 'default') => {
    const newConnection = {
      id: `conn_${Date.now()}`,
      source: sourceBlockId,
      target: targetBlockId,
      output: output,
      label: output !== 'default' ? output : ''
    };

    setFlowData(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));

    setConnectionMode(false);
    setSourceBlock(null);
    addDebugLog(`Connected ${sourceBlockId} to ${targetBlockId} via ${output}`, 'info');
  };

  const handleDeleteConnection = (connectionId) => {
    setFlowData(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
    addDebugLog('Connection deleted', 'warning');
  };

  const handleDeleteBlock = (blockId) => {
    setFlowData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      connections: prev.connections.filter(conn => 
        conn.source !== blockId && conn.target !== blockId
      )
    }));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
    addDebugLog(`Block ${blockId} deleted`, 'warning');
  };

  const addDebugLog = (message, type = 'info') => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message,
      type
    };
    setDebugLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const handleTestFlow = () => {
    setTestMode(true);
    addDebugLog('Starting flow test simulation', 'info');
    // Simulate flow execution
    setTimeout(() => {
      addDebugLog('Flow test completed successfully', 'success');
      setTestMode(false);
    }, 3000);
  };

  const handlePublishFlow = () => {
    if (flowData.blocks.length === 0) {
      addDebugLog('Cannot publish empty flow', 'error');
      return;
    }
    
    setFlowData(prev => ({ ...prev, status: 'published' }));
    addDebugLog('Flow published successfully', 'success');
  };

  const renderConnections = () => {
    if (!svgRef.current || flowData.connections.length === 0) return null;

    return flowData.connections.map(connection => {
      const sourceBlock = flowData.blocks.find(b => b.id === connection.source);
      const targetBlock = flowData.blocks.find(b => b.id === connection.target);
      
      if (!sourceBlock || !targetBlock) return null;

      // Calculate connection points from right edge of source to left edge of target
      const sourceX = sourceBlock.position.x + 200; // Right edge of source block
      const sourceY = sourceBlock.position.y + 40;  // Center height
      const targetX = targetBlock.position.x;       // Left edge of target block
      const targetY = targetBlock.position.y + 40;  // Center height

      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      
      // Create curved path with better control points
      const controlPoint1X = sourceX + 50;
      const controlPoint2X = targetX - 50;

      return (
        <g key={connection.id}>
          {/* Shadow/glow effect */}
          <path
            d={`M ${sourceX} ${sourceY} C ${controlPoint1X} ${sourceY}, ${controlPoint2X} ${targetY}, ${targetX} ${targetY}`}
            stroke={theme.palette.primary.main}
            strokeWidth="6"
            fill="none"
            opacity="0.2"
          />
          {/* Main connection line */}
          <path
            d={`M ${sourceX} ${sourceY} C ${controlPoint1X} ${sourceY}, ${controlPoint2X} ${targetY}, ${targetX} ${targetY}`}
            stroke={theme.palette.primary.main}
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            style={{
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
            }}
          />
          {/* Connection label with background */}
          {connection.label && (
            <g>
              <rect
                x={midX - 25}
                y={midY - 35}
                width="50"
                height="20"
                rx="10"
                fill={theme.palette.background.paper}
                stroke={theme.palette.primary.main}
                strokeWidth="1"
              />
              <text
                x={midX}
                y={midY - 22}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill={theme.palette.primary.main}
              >
                {connection.label}
              </text>
            </g>
          )}
          {/* Connection delete button (visible on hover) */}
          <circle
            cx={midX}
            cy={midY + 10}
            r="8"
            fill={theme.palette.error.main}
            opacity="0.8"
            style={{ cursor: 'pointer' }}
            onClick={() => handleDeleteConnection(connection.id)}
          />
          <text
            x={midX}
            y={midY + 14}
            textAnchor="middle"
            fontSize="10"
            fill="white"
            style={{ cursor: 'pointer', pointerEvents: 'none' }}
          >
            ×
          </text>
        </g>
      );
    });
  };

  const renderBlockConfig = () => {
    if (!selectedBlock) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Select a block to configure
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click on any block in the canvas to edit its properties
          </Typography>
        </Box>
      );
    }

    const { type, config } = selectedBlock;

    const renderTabContent = () => {
      switch (activeTab) {
        case 0: // Configuration
          return renderBlockConfiguration(type, config);
        case 1: // Connections
          return renderConnectionsTab();
        case 2: // Analytics
          return renderAnalyticsTab();
        default:
          return renderBlockConfiguration(type, config);
      }
    };

    return (
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Config" />
            <Tab label="Connect" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    );
  };

  const renderBlockConfiguration = (type, config) => {
    switch (type) {
      case 'send_message':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Send Message Configuration</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message Text"
              value={config.message || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, message: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Delay (seconds)"
              value={config.delay || 0}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, delay: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Formatting</InputLabel>
              <Select
                value={config.formatting || 'plain'}
                label="Formatting"
                onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, formatting: e.target.value })}
              >
                <MenuItem value="plain">Plain Text</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
                <MenuItem value="html">HTML</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'collect_input':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Collect Input Configuration</Typography>
            <TextField
              fullWidth
              label="Prompt Message"
              value={config.prompt || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, prompt: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Variable Name"
              value={config.variable || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, variable: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Validation</InputLabel>
              <Select
                value={config.validation || 'none'}
                label="Validation"
                onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, validation: e.target.value })}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone Number</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Timeout (seconds)"
              value={config.timeout || 300}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, timeout: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Max Retries"
              value={config.maxRetries || 3}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, maxRetries: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.required || false}
                  onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, required: e.target.checked })}
                />
              }
              label="Required Field"
            />
          </Box>
        );

      case 'api_call':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>API Call Configuration</Typography>
            <TextField
              fullWidth
              label="API URL"
              value={config.url || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, url: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={config.method || 'GET'}
                label="Method"
                onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, method: e.target.value })}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Request Body (JSON)"
              value={config.body || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, body: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Response Variable"
              value={config.responseVariable || 'api_response'}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, responseVariable: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Timeout (seconds)"
              value={config.timeout || 30}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, timeout: parseInt(e.target.value) })}
            />
          </Box>
        );

      case 'conditional':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Conditional Logic Configuration</Typography>
            <Typography variant="subtitle2" gutterBottom>Conditions</Typography>
            {(config.conditions || []).map((condition, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Variable"
                      value={condition.variable || ''}
                      onChange={(e) => {
                        const newConditions = [...(config.conditions || [])];
                        newConditions[index] = { ...condition, variable: e.target.value };
                        handleBlockUpdate(selectedBlock.id, { ...config, conditions: newConditions });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={condition.operator || 'equals'}
                        label="Operator"
                        onChange={(e) => {
                          const newConditions = [...(config.conditions || [])];
                          newConditions[index] = { ...condition, operator: e.target.value };
                          handleBlockUpdate(selectedBlock.id, { ...config, conditions: newConditions });
                        }}
                      >
                        <MenuItem value="equals">Equals</MenuItem>
                        <MenuItem value="not_equals">Not Equals</MenuItem>
                        <MenuItem value="contains">Contains</MenuItem>
                        <MenuItem value="greater_than">Greater Than</MenuItem>
                        <MenuItem value="less_than">Less Than</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Value"
                      value={condition.value || ''}
                      onChange={(e) => {
                        const newConditions = [...(config.conditions || [])];
                        newConditions[index] = { ...condition, value: e.target.value };
                        handleBlockUpdate(selectedBlock.id, { ...config, conditions: newConditions });
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newConditions = [...(config.conditions || []), { variable: '', operator: 'equals', value: '', output: 'true' }];
                handleBlockUpdate(selectedBlock.id, { ...config, conditions: newConditions });
              }}
              sx={{ mb: 2 }}
            >
              Add Condition
            </Button>
          </Box>
        );

      case 'template':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Template Configuration</Typography>
            <TextField
              fullWidth
              label="Template ID"
              value={config.templateId || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, templateId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Template Name"
              value={config.templateName || ''}
              onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, templateName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={config.language || 'en'}
                label="Language"
                onChange={(e) => handleBlockUpdate(selectedBlock.id, { ...config, language: e.target.value })}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                <MenuItem value="bn">বাংলা (Bengali)</MenuItem>
                <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                <MenuItem value="gu">ગુજરાતી (Gujarati)</MenuItem>
                <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
                <MenuItem value="kn">ಕನ್ನಡ (Kannada)</MenuItem>
                <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                <MenuItem value="as">অসমীয়া (Assamese)</MenuItem>
                <MenuItem value="or">ଓଡ଼ିଆ (Odia)</MenuItem>
                <MenuItem value="ur">اردو (Urdu)</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>{selectedBlock.name} Configuration</Typography>
            <Typography variant="body2" color="text.secondary">
              Advanced configuration panel for {selectedBlock.name} is available.
            </Typography>
          </Box>
        );
    }
  };

  const renderConnectionsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Block Connections</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Manage how this block connects to other blocks in the flow.
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Output Connections</Typography>
        {actionBlocks.find(b => b.id === selectedBlock.type)?.outputs.map(output => (
          <Box key={output} sx={{ mb: 1, p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="body2">{output}</Typography>
            <Button
              size="small"
              startIcon={<LinkIcon />}
              onClick={() => {
                setConnectionMode(true);
                setSourceBlock({ id: selectedBlock.id, output });
              }}
            >
              Connect
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Block Analytics</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Performance metrics for this block.
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">0</Typography>
            <Typography variant="body2">Executions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">0%</Typography>
            <Typography variant="body2">Success Rate</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          height: '90vh',
          maxWidth: 'none',
          maxHeight: 'none'
        }
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WhatsApp Flow Builder - {flowData.name || 'New Flow'}
          </Typography>
          
          <Chip 
            label={flowData.status} 
            color={flowData.status === 'published' ? 'success' : 'default'}
            size="small"
            sx={{ mr: 2 }}
          />
          
          <Button
            startIcon={<PlayIcon />}
            onClick={handleTestFlow}
            disabled={testMode}
            sx={{ mr: 1 }}
          >
            {testMode ? 'Testing...' : 'Test'}
          </Button>
          
          <Button
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(!previewMode)}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          
          <Button
            startIcon={<DebugIcon />}
            onClick={() => setActiveTab(3)}
            sx={{ mr: 1 }}
          >
            Debug
          </Button>
          
          <Button
            startIcon={<PublishIcon />}
            onClick={handlePublishFlow}
            disabled={flowData.status === 'published'}
            sx={{ mr: 1 }}
          >
            Publish
          </Button>
          
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save Flow
          </Button>
          
          <Button
            startIcon={<LinkIcon />}
            onClick={() => {
              // Add sample blocks and connections for demonstration
              const sampleBlocks = [
                {
                  id: 'start_block',
                  type: 'send_message',
                  name: 'Welcome Message',
                  position: { x: 100, y: 100 },
                  config: { message: 'Welcome to our service!' },
                  connections: []
                },
                {
                  id: 'input_block',
                  type: 'collect_input',
                  name: 'Get Name',
                  position: { x: 400, y: 100 },
                  config: { prompt: 'What is your name?', variable: 'user_name' },
                  connections: []
                },
                {
                  id: 'response_block',
                  type: 'send_message',
                  name: 'Thank You',
                  position: { x: 700, y: 100 },
                  config: { message: 'Thank you, {{user_name}}!' },
                  connections: []
                }
              ];
              
              const sampleConnections = [
                {
                  id: 'conn_1',
                  source: 'start_block',
                  target: 'input_block',
                  output: 'success',
                  label: 'success'
                },
                {
                  id: 'conn_2',
                  source: 'input_block',
                  target: 'response_block',
                  output: 'valid',
                  label: 'valid'
                }
              ];
              
              setFlowData(prev => ({
                ...prev,
                blocks: sampleBlocks,
                connections: sampleConnections
              }));
              
              addDebugLog('Sample flow with connections created', 'success');
            }}
            sx={{ mr: 1 }}
          >
            Demo
          </Button>
          
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100% - 64px)' }}>
        <Paper sx={{ width: 300, borderRadius: 0, borderRight: 1, borderColor: 'divider' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Block Library</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Drag blocks to the canvas to build your flow
            </Typography>
          </Box>
          <Divider />
          <List sx={{ p: 1 }}>
            {actionBlocks.map((block) => (
              <ListItem
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                sx={{
                  mb: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  cursor: 'grab',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: `${block.color}.main`, width: 32, height: 32 }}>
                    {block.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={block.name}
                  secondary={block.description}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Flow Name"
                  value={flowData.name}
                  onChange={(e) => setFlowData(prev => ({ ...prev, name: e.target.value }))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Entry Point</InputLabel>
                  <Select
                    value={flowData.entryPoint}
                    label="Entry Point"
                    onChange={(e) => setFlowData(prev => ({ ...prev, entryPoint: e.target.value }))}
                  >
                    {entryPoints.map((point) => (
                      <MenuItem key={point.value} value={point.value}>
                        {point.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Box
            ref={canvasRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              flex: 1,
              bgcolor: darkMode ? 'grey.900' : 'grey.50',
              position: 'relative',
              overflow: 'auto',
              backgroundImage: `radial-gradient(circle, ${darkMode ? '#555' : '#ccc'} 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          >
            {/* SVG overlay for connections */}
            <svg
              ref={svgRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="12"
                  markerHeight="10"
                  refX="11"
                  refY="5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 12 5, 0 10"
                    fill={theme.palette.primary.main}
                    stroke={theme.palette.primary.main}
                    strokeWidth="1"
                  />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {renderConnections()}
            </svg>

            {flowData.blocks.map((block) => (
              <Card
                key={block.id}
                onClick={() => {
                  if (connectionMode && sourceBlock) {
                    handleConnect(sourceBlock.id, block.id, sourceBlock.output);
                  } else {
                    handleBlockClick(block);
                  }
                }}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                sx={{
                  position: 'absolute',
                  left: block.position.x,
                  top: block.position.y,
                  width: 200,
                  cursor: connectionMode ? 'crosshair' : 'pointer',
                  border: selectedBlock?.id === block.id ? 2 : 1,
                  borderColor: selectedBlock?.id === block.id ? 'primary.main' : 
                              connectionMode && hoveredBlock === block.id ? 'success.main' : 'divider',
                  zIndex: 2,
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'scale(1.02)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                        {actionBlocks.find(ab => ab.id === block.type)?.icon}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {block.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {block.type.replace('_', ' ').toUpperCase()}
                  </Typography>
                  
                  {/* Connection points */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                    <Box sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%' }} />
                  </Box>
                </CardContent>
              </Card>
            ))}

            {flowData.blocks.length === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 3
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Drag blocks from the library to start building your flow
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create engaging WhatsApp conversations with our visual flow builder
                </Typography>
              </Box>
            )}

            {/* Connection mode overlay */}
            {connectionMode && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 4
                }}
              >
                <Alert 
                  severity="info" 
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => {
                        setConnectionMode(false);
                        setSourceBlock(null);
                      }}
                    >
                      Cancel
                    </Button>
                  }
                >
                  Click on a target block to create connection from {sourceBlock?.id}
                </Alert>
              </Box>
            )}
          </Box>
        </Box>

        <Paper sx={{ width: 400, borderRadius: 0, borderLeft: 1, borderColor: 'divider' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Config" />
              <Tab label="Templates" />
              <Tab label="Variables" />
              <Tab label="Debug" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>
          
          {activeTab === 0 && (
            <Box>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {selectedBlock ? `Configure ${selectedBlock.name}` : 'Block Configuration'}
                </Typography>
              </Box>
              {renderBlockConfig()}
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>WhatsApp Templates</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Manage WhatsApp message templates for your flows.
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Create New Template
              </Button>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Welcome Template"
                    secondary="Approved • Last used 2 days ago"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Renewal Reminder"
                    secondary="Pending approval"
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Flow Variables</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Variables captured and used throughout the flow.
              </Typography>
              
              <List>
                {flowData.variables.map((variable, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={variable.name}
                      secondary={`Type: ${variable.type} • Source: ${variable.source}`}
                    />
                  </ListItem>
                ))}
                {flowData.variables.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No variables defined"
                      secondary="Variables will appear here as you configure blocks"
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Debug Console</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Real-time logs and debugging information.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  size="small"
                  onClick={() => setDebugLogs([])}
                  startIcon={<DeleteIcon />}
                >
                  Clear Logs
                </Button>
              </Box>
              
              <Box
                sx={{
                  height: 300,
                  overflow: 'auto',
                  bgcolor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem'
                }}
              >
                {debugLogs.map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      mb: 0.5,
                      color: log.type === 'error' ? 'error.main' : 
                             log.type === 'warning' ? 'warning.main' :
                             log.type === 'success' ? 'success.main' : 'text.primary'
                    }}
                  >
                    <Typography variant="caption" component="span">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </Typography>
                    {' '}
                    <Typography variant="caption" component="span">
                      {log.message}
                    </Typography>
                  </Box>
                ))}
                {debugLogs.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No debug logs yet. Interact with the flow to see logs here.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          
          {activeTab === 4 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Flow Analytics</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Performance metrics and insights for this flow.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {flowData.analytics.totalRuns}
                    </Typography>
                    <Typography variant="body2">Total Runs</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {flowData.analytics.completionRate}%
                    </Typography>
                    <Typography variant="body2">Completion Rate</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {flowData.analytics.avgResponseTime}s
                    </Typography>
                    <Typography variant="body2">Avg Response Time</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Export Analytics Report
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Fab
          color="primary"
          sx={{ mb: 1 }}
          onClick={() => setMobilePreview(!mobilePreview)}
        >
          <SmartphoneIcon />
        </Fab>
        <Fab
          color="secondary"
          sx={{ mb: 1 }}
          onClick={() => setDarkMode(!darkMode)}
        >
          <DarkModeIcon />
        </Fab>
        <Fab
          color="info"
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
            element.href = URL.createObjectURL(file);
            element.download = `${flowData.name || 'flow'}.json`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            addDebugLog('Flow exported successfully', 'success');
          }}
        >
          <DownloadIcon />
        </Fab>
      </Box>

      {/* Mobile Preview Modal */}
      <Dialog
        open={mobilePreview}
        onClose={() => setMobilePreview(false)}
        maxWidth="sm"
        fullWidth
      >
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Mobile Preview
            </Typography>
            <IconButton color="inherit" onClick={() => setMobilePreview(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 300,
              height: 600,
              mx: 'auto',
              border: 2,
              borderColor: 'divider',
              borderRadius: 4,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="subtitle2">WhatsApp</Typography>
            </Box>
            <Box sx={{ p: 2, height: 500, overflow: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                Mobile preview of your WhatsApp flow will appear here.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                This feature simulates how your flow will look on mobile devices.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Dialog>
  );
};

export default FlowBuilder;
