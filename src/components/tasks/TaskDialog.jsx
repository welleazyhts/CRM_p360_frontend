import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useTaskManagement } from '../../context/TaskManagementContext';

const TaskDialog = ({ open, task, onClose }) => {
  const {
    createTask,
    updateTask,
    TASK_TYPE,
    TASK_PRIORITY,
    TASK_STATUS,
    RECURRENCE_PATTERN
  } = useTaskManagement();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: TASK_TYPE.CUSTOM,
    priority: TASK_PRIORITY.MEDIUM,
    status: TASK_STATUS.TODO,
    dueDate: '',
    estimatedDuration: 30,
    assignedTo: '',
    tags: [],
    checklist: [],
    recurring: false,
    recurrence: {
      pattern: RECURRENCE_PATTERN.DAILY,
      interval: 1,
      endDate: null
    },
    reminder: {
      enabled: false,
      minutesBefore: 30
    }
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newTag, setNewTag] = useState('');

  // Initialize form with task data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        type: task.type || TASK_TYPE.CUSTOM,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        status: task.status || TASK_STATUS.TODO,
        dueDate: task.dueDate ? task.dueDate.split('.')[0] : '',
        estimatedDuration: task.estimatedDuration || 30,
        assignedTo: task.assignedTo || '',
        tags: task.tags || [],
        checklist: task.checklist || [],
        recurring: task.recurring || false,
        recurrence: task.recurrence || {
          pattern: RECURRENCE_PATTERN.DAILY,
          interval: 1,
          endDate: null
        },
        reminder: task.reminder || {
          enabled: false,
          minutesBefore: 30
        }
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        type: TASK_TYPE.CUSTOM,
        priority: TASK_PRIORITY.MEDIUM,
        status: TASK_STATUS.TODO,
        dueDate: '',
        estimatedDuration: 30,
        assignedTo: '',
        tags: [],
        checklist: [],
        recurring: false,
        recurrence: {
          pattern: RECURRENCE_PATTERN.DAILY,
          interval: 1,
          endDate: null
        },
        reminder: {
          enabled: false,
          minutesBefore: 30
        }
      });
    }
  }, [task, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecurrenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: value
      }
    }));
  };

  const handleReminderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        [field]: value
      }
    }));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: `check_${Date.now()}`,
        text: newChecklistItem.trim(),
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, newItem]
      }));
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  const handleToggleChecklistItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate || null
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      createTask(taskData);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* Type and Priority */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                label="Type"
              >
                {Object.entries(TASK_TYPE).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                label="Priority"
              >
                {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status (if editing) */}
          {task && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label="Status"
                >
                  {Object.entries(TASK_STATUS).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Due Date and Duration */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Estimated Duration (minutes)"
              value={formData.estimatedDuration}
              onChange={(e) => handleChange('estimatedDuration', parseInt(e.target.value))}
              inputProps={{ min: 5, step: 5 }}
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outlined"
                onClick={handleAddTag}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>

          {/* Checklist */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Checklist
            </Typography>
            <List dense>
              {formData.checklist.map((item) => (
                <ListItem key={item.id}>
                  <Checkbox
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                  />
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textDecoration: item.completed ? 'line-through' : 'none'
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add checklist item"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <Button
                type="button"
                variant="outlined"
                onClick={handleAddChecklistItem}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>

          {/* Recurring */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.recurring}
                  onChange={(e) => handleChange('recurring', e.target.checked)}
                />
              }
              label="Recurring Task"
            />
          </Grid>

          {formData.recurring && (
            <>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Pattern</InputLabel>
                  <Select
                    value={formData.recurrence.pattern}
                    onChange={(e) => handleRecurrenceChange('pattern', e.target.value)}
                    label="Pattern"
                  >
                    {Object.entries(RECURRENCE_PATTERN).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Interval"
                  value={formData.recurrence.interval}
                  onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </>
          )}

          {/* Reminder */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.reminder.enabled}
                  onChange={(e) => handleReminderChange('enabled', e.target.checked)}
                />
              }
              label="Set Reminder"
            />
          </Grid>

          {formData.reminder.enabled && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Remind me (minutes before)"
                value={formData.reminder.minutesBefore}
                onChange={(e) => handleReminderChange('minutesBefore', parseInt(e.target.value))}
                inputProps={{ min: 5, step: 5 }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
          {task ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
