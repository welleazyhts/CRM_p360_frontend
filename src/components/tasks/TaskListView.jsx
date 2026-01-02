import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Checkbox,
  Tooltip,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  CheckCircle as CompleteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Flag as PriorityIcon,
  Assignment as SubtaskIcon
} from '@mui/icons-material';
import { useTaskManagement } from '../../context/TaskManagementContext';
import { isTaskOverdue, isTaskDueSoon } from '../../services/taskManagementService';

const TaskListView = ({ tasks, onEditTask, getPriorityColor, getStatusColor }) => {
  const { completeTask, deleteTask, getTaskSubtasks } = useTaskManagement();
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [selectedTask, setSelectedTask] = React.useState(null);

  const handleMenuOpen = (event, task) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTask(null);
  };

  const handleComplete = (taskId) => {
    completeTask(taskId);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedTask) {
      onEditTask(selectedTask);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedTask && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(selectedTask.id);
    }
    handleMenuClose();
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return `Due ${date.toLocaleDateString()}`;
    }
  };

  if (tasks.length === 0) {
    return (
      <Alert severity="info">
        No tasks found. Create a new task to get started!
      </Alert>
    );
  }

  return (
    <Box>
      {tasks.map((task) => {
        const subtasks = getTaskSubtasks(task.id);
        const overdue = isTaskOverdue(task);
        const dueSoon = isTaskDueSoon(task);

        return (
          <Card
            key={task.id}
            sx={{
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 3
              },
              borderLeft: overdue ? '4px solid #d32f2f' : dueSoon ? '4px solid #ed6c02' : 'none'
            }}
            onClick={() => onEditTask(task)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Checkbox */}
                <Checkbox
                  checked={task.status === 'completed'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.status !== 'completed') {
                      handleComplete(task.id);
                    }
                  }}
                  sx={{ mt: -1 }}
                />

                {/* Task Content */}
                <Box sx={{ flexGrow: 1 }}>
                  {/* Title and Priority */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      icon={<PriorityIcon />}
                    />
                    {subtasks.length > 0 && (
                      <Tooltip title={`${subtasks.length} subtask${subtasks.length !== 1 ? 's' : ''}`}>
                        <Chip
                          size="small"
                          label={subtasks.length}
                          icon={<SubtaskIcon />}
                        />
                      </Tooltip>
                    )}
                  </Box>

                  {/* Description */}
                  {task.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {task.description}
                    </Typography>
                  )}

                  {/* Tags and Metadata */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      label={task.status.replace(/_/g, ' ')}
                      color={getStatusColor(task.status)}
                    />
                    <Chip
                      size="small"
                      label={task.type.replace(/_/g, ' ')}
                    />
                    {task.dueDate && (
                      <Chip
                        size="small"
                        icon={<TimeIcon />}
                        label={formatDueDate(task.dueDate)}
                        color={overdue ? 'error' : dueSoon ? 'warning' : 'default'}
                      />
                    )}
                    {task.estimatedDuration && (
                      <Chip
                        size="small"
                        label={`${task.estimatedDuration} min`}
                      />
                    )}
                    {Array.isArray(task.tags) && task.tags.map((tag) => (
                      <Chip key={tag} size="small" label={tag} variant="outlined" />
                    ))}
                  </Box>

                  {/* Progress */}
                  {task.checklist && task.checklist.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={task.progress}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Actions Menu */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, task);
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedTask && selectedTask.status !== 'completed' && (
          <MenuItem onClick={() => handleComplete(selectedTask.id)}>
            <CompleteIcon sx={{ mr: 1 }} /> Mark Complete
          </MenuItem>
        )}
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskListView;
