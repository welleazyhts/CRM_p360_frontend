import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid, Alert } from '@mui/material';
import { useTaskManagement } from '../../context/TaskManagementContext';

const TaskKanbanView = ({ tasks, onEditTask, getPriorityColor }) => {
  const { TASK_STATUS } = useTaskManagement();

  const columns = [
    { id: TASK_STATUS.TODO, title: 'To Do', color: '#e3f2fd' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: '#fff3e0' },
    { id: TASK_STATUS.ON_HOLD, title: 'On Hold', color: '#fce4ec' },
    { id: TASK_STATUS.COMPLETED, title: 'Completed', color: '#e8f5e9' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (tasks.length === 0) {
    return <Alert severity="info">No tasks found.</Alert>;
  }

  return (
    <Grid container spacing={2}>
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <Grid item xs={12} md={3} key={column.id}>
            <Box
              sx={{
                backgroundColor: column.color,
                borderRadius: 1,
                p: 2,
                minHeight: 500
              }}
            >
              <Typography variant="h6" gutterBottom>
                {column.title}
                <Chip
                  label={columnTasks.length}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>

              <Box sx={{ mt: 2 }}>
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => onEditTask(task)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                        <Chip
                          size="small"
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                        />
                        <Chip size="small" label={task.type.replace(/_/g, ' ')} />
                      </Box>
                      {task.dueDate && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                      {task.progress > 0 && (
                        <Typography variant="caption" display="block" color="primary">
                          {task.progress}% complete
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TaskKanbanView;
