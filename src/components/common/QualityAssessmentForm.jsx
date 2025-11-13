import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const assessmentCategories = [
  {
    id: 'opening',
    title: 'Call Opening',
    criteria: [
      { id: 'greeting', label: 'Professional Greeting', type: 'binary' },
      { id: 'identity', label: 'Proper Self-Introduction', type: 'binary' },
      { id: 'purpose', label: 'Purpose Verification', type: 'binary' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    criteria: [
      { id: 'clarity', label: 'Speech Clarity', type: 'rating' },
      { id: 'listening', label: 'Active Listening', type: 'rating' },
      { id: 'language', label: 'Language Proficiency', type: 'rating' },
      { id: 'tone', label: 'Tone and Courtesy', type: 'rating' },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Knowledge',
    criteria: [
      { id: 'productKnowledge', label: 'Product Knowledge', type: 'rating' },
      { id: 'accuracy', label: 'Information Accuracy', type: 'rating' },
      { id: 'solutions', label: 'Solution Effectiveness', type: 'rating' },
    ],
  },
  {
    id: 'process',
    title: 'Process Adherence',
    criteria: [
      { id: 'verification', label: 'Customer Verification Process', type: 'binary' },
      { id: 'compliance', label: 'Compliance Guidelines Followed', type: 'binary' },
      { id: 'documentation', label: 'Proper Documentation', type: 'binary' },
    ],
  },
  {
    id: 'resolution',
    title: 'Call Resolution',
    criteria: [
      { id: 'understanding', label: 'Problem Understanding', type: 'rating' },
      { id: 'effectiveness', label: 'Resolution Effectiveness', type: 'rating' },
      { id: 'followup', label: 'Follow-up Actions Clarity', type: 'rating' },
    ],
  },
  {
    id: 'closing',
    title: 'Call Closing',
    criteria: [
      { id: 'summary', label: 'Call Summary Provided', type: 'binary' },
      { id: 'nextSteps', label: 'Next Steps Explained', type: 'binary' },
      { id: 'farewell', label: 'Professional Farewell', type: 'binary' },
    ],
  },
];

const QualityAssessmentForm = ({ onAssessmentChange }) => {
  const [assessmentData, setAssessmentData] = useState({});
  const [criticalObservations, setCriticalObservations] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleCriteriaChange = (categoryId, criterionId, value) => {
    const newData = {
      ...assessmentData,
      [categoryId]: {
        ...assessmentData[categoryId],
        [criterionId]: value,
      },
    };
    setAssessmentData(newData);
    
    // Calculate scores and notify parent
    const scores = calculateScores(newData);
    onAssessmentChange({
      scores,
      assessmentData: newData,
      criticalObservations,
      recommendations,
    });
  };

  const calculateScores = (data) => {
    const scores = {};
    let totalScore = 0;
    let totalMaxScore = 0;

    assessmentCategories.forEach(category => {
      let categoryScore = 0;
      let categoryMaxScore = 0;

      category.criteria.forEach(criterion => {
        const value = data[category.id]?.[criterion.id];
        if (value !== undefined) {
          if (criterion.type === 'binary') {
            categoryScore += value ? 1 : 0;
            categoryMaxScore += 1;
          } else if (criterion.type === 'rating') {
            categoryScore += value;
            categoryMaxScore += 5; // Max rating is 5
          }
        }
      });

      scores[category.id] = {
        score: categoryScore,
        maxScore: categoryMaxScore,
        percentage: categoryMaxScore > 0 ? (categoryScore / categoryMaxScore) * 100 : 0,
      };

      totalScore += categoryScore;
      totalMaxScore += categoryMaxScore;
    });

    scores.overall = {
      score: totalScore,
      maxScore: totalMaxScore,
      percentage: totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0,
    };

    return scores;
  };

  return (
    <Box>
      {assessmentCategories.map((category) => (
        <Accordion key={category.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="600">
              {category.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {category.criteria.map((criterion) => (
                <FormControl key={criterion.id}>
                  <FormLabel>{criterion.label}</FormLabel>
                  {criterion.type === 'binary' ? (
                    <RadioGroup
                      row
                      value={assessmentData[category.id]?.[criterion.id] || false}
                      onChange={(e) =>
                        handleCriteriaChange(
                          category.id,
                          criterion.id,
                          e.target.value === 'true'
                        )
                      }
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  ) : (
                    <Rating
                      value={assessmentData[category.id]?.[criterion.id] || 0}
                      onChange={(_, value) =>
                        handleCriteriaChange(category.id, criterion.id, value)
                      }
                    />
                  )}
                </FormControl>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Critical Observations
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={criticalObservations}
          onChange={(e) => {
            setCriticalObservations(e.target.value);
            onAssessmentChange({
              scores: calculateScores(assessmentData),
              assessmentData,
              criticalObservations: e.target.value,
              recommendations,
            });
          }}
          placeholder="Note any critical issues or exceptional performance observed during the call"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Recommendations for Improvement
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={recommendations}
          onChange={(e) => {
            setRecommendations(e.target.value);
            onAssessmentChange({
              scores: calculateScores(assessmentData),
              assessmentData,
              criticalObservations,
              recommendations: e.target.value,
            });
          }}
          placeholder="Provide specific recommendations for improvement and training needs"
        />
      </Box>
    </Box>
  );
};

export default QualityAssessmentForm;