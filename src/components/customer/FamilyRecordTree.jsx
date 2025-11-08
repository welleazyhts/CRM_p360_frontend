import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Grid,
  List, ListItem, ListItemIcon, ListItemText, Divider, useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  Policy as PolicyIcon,
  DirectionsCar as VehicleIcon,
  AccountTree as TreeIcon
} from '@mui/icons-material';

const FamilyRecordTree = ({ customer }) => {
  const theme = useTheme();

  const getRelationshipColor = (relationship) => {
    const colors = {
      'Spouse': theme.palette.primary.main,
      'Son': theme.palette.success.main,
      'Daughter': theme.palette.success.main,
      'Father': theme.palette.warning.main,
      'Mother': theme.palette.warning.main,
      'Brother': theme.palette.info.main,
      'Sister': theme.palette.info.main,
    };
    return colors[relationship] || theme.palette.grey[500];
  };

  if (!customer?.familyMembers || customer.familyMembers.length === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <FamilyIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Family Members Found
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TreeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h5" fontWeight="600">
          Family Record Tree
        </Typography>
      </Box>

      <Card sx={{ mb: 3, border: `2px solid ${theme.palette.primary.main}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 56, height: 56 }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="600">
                {customer.name}
              </Typography>
              <Chip label="Primary Customer" color="primary" size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
        Family Members ({customer.familyMembers.length})
      </Typography>

      <Grid container spacing={2}>
        {customer.familyMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id}>
            <Card sx={{ 
              height: '100%',
              border: `1px solid ${getRelationshipColor(member.relationship)}20`,
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: getRelationshipColor(member.relationship), 
                    mr: 2,
                    width: 48,
                    height: 48
                  }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {member.name}
                    </Typography>
                    <Chip 
                      label={member.relationship} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${getRelationshipColor(member.relationship)}20`,
                        color: getRelationshipColor(member.relationship),
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PolicyIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Covered Policies" 
                      secondary={member.coveredPolicies?.length || 0}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <VehicleIcon fontSize="small" color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Vehicles" 
                      secondary={member.vehicles?.length || 0}
                    />
                  </ListItem>
                </List>

                {member.coveredPolicies && member.coveredPolicies.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Policy Numbers:
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {member.coveredPolicies.map((policyId, index) => (
                        <Chip 
                          key={index}
                          label={policyId} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FamilyRecordTree;