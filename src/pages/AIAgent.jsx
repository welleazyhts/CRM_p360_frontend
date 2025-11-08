import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AskAIIcon from '@mui/icons-material/SmartToy';

const AIAgent = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    const q = query.trim();
    if (!q) return;

    const userMsg = { id: Date.now(), type: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Simple AI response without cross-resource lookup
    const aiText = 'I can help you with general questions, but cross-resource data lookup has been disabled.';
    const aiMsg = { id: Date.now()+1, type: 'ai', text: aiText };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AskAIIcon /> AI Assistant
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField fullWidth size="small" placeholder="Ask me anything..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') handleSend(); }} />
          <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleSend}>Send</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, minHeight: 300 }} elevation={0}>
        <List>
          {messages.length === 0 && (
            <ListItem>
              <ListItemText primary="No messages yet. Start a conversation with the AI assistant." />
            </ListItem>
          )}

          {messages.map((m) => (
            <ListItem key={m.id} alignItems="flex-start">
              <ListItemText
                primary={m.type === 'user' ? 'You' : 'AI Assistant'}
                secondary={m.text}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AIAgent;
