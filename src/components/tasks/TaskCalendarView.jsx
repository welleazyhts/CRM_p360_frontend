import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon
} from '@mui/icons-material';

const TaskCalendarView = ({ tasks, onEditTask, onCreateTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{monthName}</Typography>
        <Box>
          <IconButton onClick={handlePrevMonth}>
            <PrevIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth}>
            <NextIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Card>
        <CardContent>
          <Grid container>
            {/* Week day headers */}
            {weekDays.map((day) => (
              <Grid item xs={12 / 7} key={day}>
                <Box sx={{ textAlign: 'center', fontWeight: 'bold', p: 1 }}>
                  {day}
                </Box>
              </Grid>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              const dayTasks = date ? getTasksForDate(date) : [];
              const isToday = date &&
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();

              return (
                <Grid item xs={12 / 7} key={index}>
                  <Box
                    sx={{
                      minHeight: 100,
                      p: 1,
                      border: '1px solid #e0e0e0',
                      backgroundColor: isToday ? '#e3f2fd' : 'transparent',
                      cursor: date ? 'pointer' : 'default',
                      '&:hover': date ? { backgroundColor: '#f5f5f5' } : {}
                    }}
                    onClick={() => date && onCreateTask && onCreateTask({ dueDate: date.toISOString() })}
                  >
                    {date && (
                      <>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isToday ? 'bold' : 'normal',
                            color: isToday ? 'primary.main' : 'text.primary'
                          }}
                        >
                          {date.getDate()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {dayTasks.slice(0, 3).map((task) => (
                            <Chip
                              key={task.id}
                              label={task.title}
                              size="small"
                              sx={{
                                mb: 0.5,
                                width: '100%',
                                fontSize: '0.7rem',
                                height: '20px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTask(task);
                              }}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{dayTasks.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskCalendarView;
