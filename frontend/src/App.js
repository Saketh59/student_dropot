import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Typography, Paper, useMediaQuery } from '@mui/material';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import theme from './theme';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import { studentApi } from './services/api';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch statistics when the component mounts or when refresh changes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await studentApi.getAllStudents();
        const students = response.data || [];
        
        setStats({
          total: students.length,
          highRisk: students.filter(s => s.riskLevel === 'High').length,
          mediumRisk: students.filter(s => s.riskLevel === 'Medium').length,
          lowRisk: students.filter(s => s.riskLevel === 'Low').length,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, [refresh]);

  const handleStudentAdded = (student) => {
    // Increment refresh counter to trigger data refresh in child components
    setRefresh(prev => prev + 1);
    
    // Update stats
    setStats(prev => ({
      total: prev.total + 1,
      highRisk: student.riskLevel === 'High' ? prev.highRisk + 1 : prev.highRisk,
      mediumRisk: student.riskLevel === 'Medium' ? prev.mediumRisk + 1 : prev.mediumRisk,
      lowRisk: student.riskLevel === 'Low' ? prev.lowRisk + 1 : prev.lowRisk,
    }));
  };

  const StatCard = ({ value, label, color, icon: Icon }) => (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        flex: 1, 
        minWidth: isMobile ? '100%' : 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${color}10 0%, ${color}30 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <Box 
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          bgcolor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1.5,
        }}
      >
        {Icon && <Icon sx={{ color, fontSize: 24 }} />}
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold" color={color}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          {/* Header */}
          <Box 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              py: 4,
              mb: 4,
              boxShadow: 2,
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Student Dropout Prediction
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Monitor and predict student dropout risks using academic performance metrics
              </Typography>
            </Container>
          </Box>

          <Container maxWidth="lg" sx={{ mb: 6 }}>
            {/* Stats Overview */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 3, 
                mb: 4,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <StatCard 
                value={stats.total} 
                label="Total Students" 
                color={theme.palette.primary.main} 
              />
              <StatCard 
                value={stats.highRisk} 
                label="High Risk" 
                color={theme.palette.error.main} 
              />
              <StatCard 
                value={stats.mediumRisk} 
                label="Medium Risk" 
                color={theme.palette.warning.main} 
              />
              <StatCard 
                value={stats.lowRisk} 
                label="Low Risk" 
                color={theme.palette.success.main} 
              />
            </Box>

            {/* Main Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Student Form */}
              <StudentForm onStudentAdded={handleStudentAdded} />
              
              {/* Student List */}
              <StudentList refresh={refresh} onRefresh={() => setRefresh(prev => prev + 1)} />
            </Box>
          </Container>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              bgcolor: 'background.paper',
              py: 3,
              mt: 'auto',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Student Dropout Prediction System
              </Typography>
            </Container>
          </Box>
        </Box>
      </EmotionThemeProvider>
    </ThemeProvider>
  );
}

export default App;
