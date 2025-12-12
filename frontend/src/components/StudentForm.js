import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Slider,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import { studentApi } from '../services/api';

const StudentForm = ({ onStudentAdded }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    attendance: 75,
    cgpa: 7.5,
    assignmentCompletion: 70,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Student name is required');
      }
      if (formData.attendance < 0 || formData.attendance > 100) {
        throw new Error('Attendance must be between 0 and 100');
      }
      if (formData.cgpa < 0 || formData.cgpa > 10) {
        throw new Error('CGPA must be between 0 and 10');
      }
      if (formData.assignmentCompletion < 0 || formData.assignmentCompletion > 100) {
        throw new Error('Assignment completion must be between 0 and 100');
      }

      // Submit data
      const response = await studentApi.createStudent({
        name: formData.name,
        attendance: parseFloat(formData.attendance),
        cgpa: parseFloat(formData.cgpa),
        assignmentCompletion: parseFloat(formData.assignmentCompletion)
      });

      setSuccess('Student record added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        attendance: 75,
        cgpa: 7.5,
        assignmentCompletion: 70,
      });
      
      // Notify parent component
      if (onStudentAdded) {
        onStudentAdded(response.data);
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message || 'Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate risk level based on inputs
  const calculateRiskLevel = () => {
    // Simple risk calculation (same as backend for consistency)
    const weights = {
      attendance: 0.4,
      cgpa: 0.4,
      assignment: 0.2
    };

    const normalizedCGPA = (formData.cgpa / 10) * 100;
    const weightedScore = 
      ((100 - formData.attendance) * weights.attendance) + 
      ((100 - normalizedCGPA) * weights.cgpa) + 
      ((100 - formData.assignmentCompletion) * weights.assignment);

    const probability = Math.min(100, Math.max(0, Math.round(weightedScore)));
    
    let riskLevel = 'Low';
    let color = theme.palette.success.main;
    
    if (probability >= 70) {
      riskLevel = 'High';
      color = theme.palette.error.main;
    } else if (probability >= 30) {
      riskLevel = 'Medium';
      color = theme.palette.warning.main;
    }
    
    return { probability, riskLevel, color };
  };

  const { probability, riskLevel, color } = calculateRiskLevel();

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h5" component="h2">
            Add New Student
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Basic Information</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Student Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                  
                  <Box mt={3} mb={2}>
                    <Box display="flex" alignItems="center" mt={1}>
                      <WarningIcon color="primary" sx={{ mr: 1 }} />
                      <Typography id="attendance-slider" gutterBottom>
                        Attendance: {formData.attendance}%
                      </Typography>
                    </Box>
                    <Slider
                      value={formData.attendance}
                      onChange={handleSliderChange('attendance')}
                      aria-labelledby="attendance-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                      ]}
                    />
                  </Box>
                  
                  <Box mt={4} mb={2}>
                    <Box display="flex" alignItems="center" mt={1}>
                      <SchoolOutlinedIcon 
                        color={formData.cgpa < 5 ? 'error' : formData.cgpa < 7 ? 'warning' : 'success'} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography variant="subtitle2" color="textSecondary">
                        CGPA: {formData.cgpa.toFixed(1)}/10.0
                      </Typography>
                    </Box>
                    <Slider
                      value={formData.cgpa}
                      onChange={handleSliderChange('cgpa')}
                      aria-labelledby="cgpa-slider"
                      valueLabelDisplay="auto"
                      step={0.1}
                      min={0}
                      max={10}
                      marks={[
                        { value: 0, label: '0.0' },
                        { value: 5, label: '5.0' },
                        { value: 10, label: '10.0' },
                      ]}
                    />
                  </Box>
                  
                  <Box mt={4} mb={2}>
                    <Typography id="assignment-slider" gutterBottom>
                      Assignment Completion: {formData.assignmentCompletion}%
                    </Typography>
                    <Slider
                      value={formData.assignmentCompletion}
                      onChange={handleSliderChange('assignmentCompletion')}
                      aria-labelledby="assignment-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={100}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                      ]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WarningIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Risk Assessment</Typography>
                  </Box>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Dropout Risk Assessment
                    </Typography>
                    
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Low Risk</Typography>
                        <Typography variant="body2">High Risk</Typography>
                      </Box>
                      
                      <Box 
                        sx={{
                          height: 12,
                          background: `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
                          borderRadius: 6,
                          position: 'relative',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -5,
                            left: `${probability}%`,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: `3px solid ${theme.palette.background.paper}`,
                            transform: 'translateX(-50%)',
                            boxShadow: 2,
                          }}
                        />
                      </Box>
                      
                      <Box textAlign="center" mt={3}>
                        <Typography variant="h4" style={{ color }}>
                          {probability}%
                        </Typography>
                        <Box mt={2} display="flex" alignItems="center">
                          {riskLevel === 'High' ? (
                            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
                          ) : riskLevel === 'Medium' ? (
                            <WarningIcon color="warning" sx={{ mr: 1 }} />
                          ) : (
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="h6" color={color}>
                            {riskLevel} Risk
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        <strong>Risk Assessment Factors:</strong>
                      </Typography>
                      <ul style={{ margin: '8px 0', paddingLeft: 24 }}>
                        <li>Attendance: {formData.attendance}% (40% weight)</li>
                        <li>CGPA: {formData.cgpa.toFixed(1)}/10 (40% weight)</li>
                        <li>Assignment Completion: {formData.assignmentCompletion}% (20% weight)</li>
                      </ul>
                    </Box>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Adding Student...' : 'Add Student'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
