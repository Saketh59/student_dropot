import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Typography,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ButtonGroup,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  GetApp as ExcelIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  PersonOutline as PersonOutlineIcon,
  TrendingUpOutlined as TrendingUpOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon,
  ErrorOutline as ErrorOutlineIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { studentApi } from '../services/api';
import { saveAs } from 'file-saver';

// Risk level chip component
const RiskChip = ({ riskLevel }) => {
  const theme = useTheme();
  
  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'High':
        return {
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
        };
      case 'Medium':
        return {
          bgcolor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
        };
      default:
        return {
          bgcolor: theme.palette.success.light,
          color: theme.palette.success.contrastText,
        };
    }
  };

  return (
    <Chip
      label={riskLevel}
      size="small"
      sx={{
        ...getRiskStyles(),
        fontWeight: 600,
        minWidth: 80,
        justifyContent: 'center',
      }}
    />
  );
};

const StudentList = ({ refresh, onRefresh }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sorting state
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  
  // Report generation state
  const [generatingExcel, setGeneratingExcel] = useState(false);

  // Fetch students data
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await studentApi.getAllStudents();
      setStudents(response.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load student data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when refresh prop changes
  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter students based on search term and risk level
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    
    // Handle different data types for sorting
    if (orderBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (orderBy === 'riskLevel') {
      // Custom sort for risk levels (High > Medium > Low)
      const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    } else {
      // Numeric fields
      comparison = a[orderBy] > b[orderBy] ? 1 : -1;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });

  // Get current students for pagination
  const paginatedStudents = sortedStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  // Generate Excel report
  const handleGenerateExcel = async () => {
    setGeneratingExcel(true);
    try {
      const excelBlob = await studentApi.generateExcelReport();
      saveAs(new Blob([excelBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'student_dropout_report.xlsx');
    } catch (err) {
      console.error('Error generating Excel:', err);
      setError('Failed to generate Excel report. Please try again.');
    } finally {
      setGeneratingExcel(false);
    }
  };

  // Table headers with sortable options and icons
  const headCells = [
    { 
      id: 'name', 
      label: 'Student Name', 
      sortable: true,
      icon: <PersonOutlineIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
    { 
      id: 'attendance', 
      label: 'Attendance %', 
      sortable: true, 
      align: 'right',
      icon: <TrendingUpOutlinedIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
    { 
      id: 'cgpa', 
      label: 'CGPA', 
      sortable: true, 
      align: 'right',
      icon: <SchoolOutlinedIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
    { 
      id: 'assignmentCompletion', 
      label: 'Assignments %', 
      sortable: true, 
      align: 'right',
      icon: <AssignmentTurnedInOutlinedIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
    { 
      id: 'dropoutProbability', 
      label: 'Dropout Risk %', 
      sortable: true, 
      align: 'right',
      icon: <ErrorOutlineIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
    { 
      id: 'riskLevel', 
      label: 'Risk Level', 
      sortable: true, 
      align: 'center',
      icon: <WarningIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
    },
  ];

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
          <Box display="flex" alignItems="center">
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h2">
              Student Records
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} mt={{ xs: 2, sm: 0 }}>
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title={students.length === 0 ? 'No data to export' : 'Generate Excel Report'}>
                <span> {/* Wrapper span for disabled button */}
                  <Button 
                    onClick={handleGenerateExcel} 
                    disabled={generatingExcel || students.length === 0}
                    startIcon={generatingExcel ? <CircularProgress size={20} /> : <ExcelIcon />}
                  >
                    {!isMobile && 'Export to Excel'}
                  </Button>
                </span>
              </Tooltip>
              
              <Tooltip title="Refresh Data">
                <Button 
                  onClick={() => {
                    if (onRefresh) onRefresh();
                    fetchStudents();
                  }} 
                  startIcon={<RefreshIcon />}
                >
                  {!isMobile && 'Refresh'}
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Box>
        
        {/* Filters */}
        <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
          <TextField
            size="small"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200, flex: 1 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="risk-filter-label">Filter by Risk</InputLabel>
            <Select
              labelId="risk-filter-label"
              value={riskFilter}
              label="Filter by Risk"
              onChange={(e) => setRiskFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Risk Levels</MenuItem>
              <MenuItem value="High">High Risk</MenuItem>
              <MenuItem value="Medium">Medium Risk</MenuItem>
              <MenuItem value="Low">Low Risk</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Alert severity="info">No student records found. Add a new student to get started.</Alert>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
              <Table stickyHeader aria-label="student records table" size="small">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                      >
                        {headCell.sortable ? (
                          <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => handleRequestSort(headCell.id)}
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            {headCell.icon}
                            {headCell.label}
                            {orderBy === headCell.id ? (
                              <Box component="span" sx={theme.mixins.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null}
                          </TableSortLabel>
                        ) : (
                          headCell.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow hover key={student._id}>
                      <TableCell component="th" scope="row">
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, mr: 1 }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" noWrap fontWeight="medium">
                              {student.name}
                            </Typography>
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <SchoolIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="caption" color="textSecondary">
                                ID: {student._id.slice(-6).toUpperCase()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <TrendingUpIcon 
                            fontSize="small" 
                            color={student.attendance < 75 ? 'error' : 'success'} 
                            sx={{ mr: 0.5 }}
                          />
                          {student.attendance}%
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <SchoolOutlinedIcon 
                            fontSize="small" 
                            color={student.cgpa < 5 ? 'error' : student.cgpa < 7 ? 'warning' : 'success'}
                            sx={{ mr: 0.5 }}
                          />
                          {student.cgpa.toFixed(2)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <AssignmentIcon 
                            fontSize="small" 
                            color={student.assignmentCompletion < 75 ? 'error' : 'success'}
                            sx={{ mr: 0.5 }}
                          />
                          {student.assignmentCompletion}%
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                          <Box width={60} textAlign="right" mr={1}>
                            {student.dropoutProbability}%
                          </Box>
                          {student.dropoutProbability >= 70 ? (
                            <ArrowUpwardIcon fontSize="small" color="error" />
                          ) : student.dropoutProbability >= 30 ? (
                            <ArrowUpwardIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                          ) : (
                            <ArrowDownwardIcon fontSize="small" color="success" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <RiskChip riskLevel={student.riskLevel} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
