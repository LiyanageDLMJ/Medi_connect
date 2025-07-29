import React from 'react';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Download, FileText, Users, Briefcase, TrendingUp, Calendar } from 'lucide-react';
import ReportGenerator from '../components/ReportGenerator';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartData,
  ChartOptions,
  PointElement,
  LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

// Enhanced color palette with more vibrant colors
interface ColorPalette {
  blue: string;
  indigo: string;
  purple: string;
  pink: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  teal: string;
  cyan: string;
  lime: string;
  violet: string;
}

const MedicalDashboard: React.FC = () => {
  // Vibrant color palette
  const colors: ColorPalette = {
    blue: '#3B82F6',
    indigo: '#6366F1',
    purple: '#8B5CF6',
    pink: '#EC4899',
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#F59E0B',
    green: '#10B981',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    lime: '#84CC16',
    violet: '#7C3AED'
  };

  const [counts, setCounts] = useState({
    total: 0,
    doctorCount: 0,
    studentCount: 0,
    instituteCount: 0,
    recruiterCount: 0,
    CardiologistCount: 0,
    PediatricianCount: 0,
    GeneralPhysicianCount: 0,
    PulmonologistCount: 0,
    EndocrinologistCount: 0,
    BiomedicineCount: 0,
    DentistryCount: 0,
    ClinicalChemistryCount: 0,
    GeneralMedicineCount: 0,
  });

  const [jobCounts, setJobCounts] = useState({
    totalJobs: 0,
    fullTimeCount: 0,
    partTimeCount: 0,
    internCount: 0,
    CardiologistCount: 0,
    PediatricianCount: 0,
    GeneralPhysicianCount: 0,
    PulmonologistCount: 0,
    OrthopedicsCount: 0,
  });

  type UserType = {
    email: string;
    userType: string;
    location: string;
    specialty: string;
    createdAt: string;
    updatedAt: string;
  };

  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTrends, setExpandedTrends] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('12months');
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '3months' | '6months' | '12months' | 'all'>('30days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userCountsRes, jobCountsRes, usersRes, jobsRes, detailedStatsRes] = await Promise.all([
          fetch("http://localhost:3000/api/admin/users/count"),
          fetch("http://localhost:3000/api/admin/jobCount"),
          fetch("http://localhost:3000/api/admin/users"),
          fetch("http://localhost:3000/api/admin/jobs"),
          fetch("http://localhost:3000/api/admin/reports/user-stats")
        ]);

        if (!userCountsRes.ok) throw new Error("Failed to fetch user counts");
        if (!jobCountsRes.ok) throw new Error("Failed to fetch job counts");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
        if (!detailedStatsRes.ok) throw new Error("Failed to fetch detailed stats");

        const [userCounts, jobCounts, users, jobs, detailedStats] = await Promise.all([
          userCountsRes.json(),
          jobCountsRes.json(),
          usersRes.json(),
          jobsRes.json(),
          detailedStatsRes.json()
        ]);

        // Debug logging for active users data
        console.log('User Counts:', userCounts);
        console.log('Detailed Stats:', detailedStats);
        console.log('Active Users Data:', {
          doctors: detailedStats?.activeUsers?.doctors || 0,
          students: detailedStats?.activeUsers?.students || 0,
          institutes: detailedStats?.activeUsers?.institutes || 0,
          recruiters: detailedStats?.activeUsers?.recruiters || 0
        });

        // Test if detailedStats has the expected structure
        if (!detailedStats || !detailedStats.activeUsers) {
          console.error('Detailed stats structure is missing:', detailedStats);
        } else {
          console.log('Detailed stats structure is correct:', detailedStats.activeUsers);
        }

        setCounts(userCounts);
        setJobCounts(jobCounts);
        setAllUsers(users);
        setAllJobs(jobs);
        setDetailedStats(detailedStats);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Export functionality
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportUserReport = () => {
    const userReport = allUsers.map(user => ({
      Email: user.email,
      'User Type': user.userType,
      Location: user.location || 'N/A',
      Specialty: user.specialty || 'N/A',
      'Created Date': new Date(user.createdAt).toLocaleDateString(),
      'Last Updated': new Date(user.updatedAt).toLocaleDateString()
    }));
    exportToCSV(userReport, 'user_report');
  };

  const exportJobReport = () => {
    const jobReport = allJobs.map(job => ({
      'Job ID': job.jobId || 'N/A',
      Title: job.title || 'N/A',
      Department: job.department || 'N/A',
      'Hospital Name': job.hospitalName || 'N/A',
      Location: job.location || 'N/A',
      'Job Type': job.jobType || 'N/A',
      'Salary Range': job.salaryRange || 'N/A',
      Urgent: job.urgent ? 'Yes' : 'No',
      'Created Date': new Date(job.createdAt).toLocaleDateString()
    }));
    exportToCSV(jobReport, 'job_report');
  };

  // Chart data configurations
  const specialtyData: ChartData<'pie'> = {
    labels: ['Pediatrician', 'Cardiologist', 'General Physician', 'Pulmonologist', 'Endocrinologist'],
    datasets: [{
      data: [counts.PediatricianCount, counts.CardiologistCount, counts.GeneralPhysicianCount, counts.PulmonologistCount, counts.EndocrinologistCount],
      backgroundColor: [
        colors.pink,
        colors.violet,
        colors.orange,
        colors.purple,
        colors.red
      ],
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  const userData: ChartData<'bar'> = {
    labels: ['Doctors', 'Medical Students', 'Institutes', 'Recruiters'],
    datasets: [{
      label: 'User Count',
      data: [counts.doctorCount, counts.studentCount, counts.instituteCount, counts.recruiterCount],
      backgroundColor: [
        colors.blue,
        colors.green,
        colors.indigo,
        colors.teal
      ],
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };

  const jobTypeData: ChartData<'doughnut'> = {
    labels: ['Cardiologist', 'Pediatrician', 'General Physician', 'Neurosurgeon', 'Orthopedics'],
    datasets: [{
      data: [jobCounts.CardiologistCount, jobCounts.PediatricianCount, jobCounts.GeneralPhysicianCount, jobCounts.PulmonologistCount, jobCounts.OrthopedicsCount],
      backgroundColor: [
        colors.cyan,
        colors.lime,
        colors.yellow,
        colors.violet,
        colors.red
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const employmentData: ChartData<'pie'> = {
    labels: ['Full Time', 'Part Time', 'Internship'],
    datasets: [{
      data: [jobCounts.fullTimeCount, jobCounts.partTimeCount, jobCounts.internCount],
      backgroundColor: [
        colors.green,
        colors.orange,
        colors.blue
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const studyData: ChartData<'bar'> = {
    labels: ['Biomedicine', 'Dentistry', 'Clinical Chemistry', 'General Medicine'],
    datasets: [{
      label: 'Students',
      data: [counts.BiomedicineCount, counts.DentistryCount, counts.ClinicalChemistryCount, counts.GeneralMedicineCount],
      backgroundColor: [
        colors.indigo,
        colors.pink,
        colors.red,
        colors.blue
      ],
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#fff'
    }]
  };

  // Monthly trends data with real data
  const monthlyTrendsData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: detailedStats?.monthlyStats?.doctors?.map((val: number, idx: number) =>
          val + (detailedStats?.monthlyStats?.students?.[idx] || 0) +
          (detailedStats?.monthlyStats?.institutes?.[idx] || 0) +
          (detailedStats?.monthlyStats?.recruiters?.[idx] || 0)
        ) || [12, 19, 15, 25, 22, 30],
        borderColor: colors.blue,
        backgroundColor: colors.blue + '20',
        tension: 0.4
      },
      {
        label: 'New Jobs',
        data: [8, 15, 12, 20, 18, 25],
        borderColor: colors.green,
        backgroundColor: colors.green + '20',
        tension: 0.4
      }
    ]
  };

  // User Registration Trends with actual database dates
  const generateRegistrationTrends = (timeRange = '12months') => {
    if (!allUsers.length) return { labels: [], datasets: [] };

    let monthsCount = 12;
    let months = [];
    const currentDate = new Date();

    switch (timeRange) {
      case '6months':
        monthsCount = 6;
        break;
      case '12months':
        monthsCount = 12;
        break;
      case '24months':
        monthsCount = 24;
        break;
      default:
        monthsCount = 12;
    }

    // Generate month labels
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }

    // Initialize data arrays for each user type
    const doctorsData = new Array(monthsCount).fill(0);
    const studentsData = new Array(monthsCount).fill(0);
    const institutesData = new Array(monthsCount).fill(0);
    const recruitersData = new Array(monthsCount).fill(0);

    // Process each user and count by creation month
    allUsers.forEach(user => {
      const createdDate = new Date(user.createdAt);
      const monthDiff = currentDate.getMonth() - createdDate.getMonth() +
        (currentDate.getFullYear() - createdDate.getFullYear()) * 12;

      if (monthDiff >= 0 && monthDiff < monthsCount) {
        const monthIndex = monthsCount - 1 - monthDiff; // Reverse to show oldest first

        switch (user.userType) {
          case 'Doctor':
            doctorsData[monthIndex]++;
            break;
          case 'MedicalStudent':
            studentsData[monthIndex]++;
            break;
          case 'EducationalInstitute':
            institutesData[monthIndex]++;
            break;
          case 'Recruiter':
            recruitersData[monthIndex]++;
            break;
        }
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Doctors',
          data: doctorsData,
          borderColor: colors.blue,
          backgroundColor: colors.blue + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Medical Students',
          data: studentsData,
          borderColor: colors.green,
          backgroundColor: colors.green + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Educational Institutes',
          data: institutesData,
          borderColor: colors.purple,
          backgroundColor: colors.purple + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Recruiters',
          data: recruitersData,
          borderColor: colors.orange,
          backgroundColor: colors.orange + '20',
          tension: 0.4,
          fill: false
        }
      ]
    };
  };

  // New time-based data generation function
  const generateTimeBasedData = (timeRange: string) => {
    if (!allUsers.length) return { labels: [], datasets: [] };

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '12months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        break;
      case 'all':
      default:
        // Find the earliest registration date
        startDate = new Date(Math.min(...allUsers.map(u => new Date(u.createdAt).getTime())));
        break;
    }

    // Filter users within the time range
    const filteredUsers = allUsers.filter(user =>
      new Date(user.createdAt) >= startDate
    );

    // Group by time unit based on the selected range
    let labels: string[] = [];
    const doctorsData: number[] = [];
    const studentsData: number[] = [];
    const institutesData: number[] = [];
    const recruitersData: number[] = [];

    if (timeRange === '7days' || timeRange === '30days') {
      // Daily grouping
      const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(dateStr);

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= dayStart && userDate <= dayEnd;
        });

        doctorsData.push(dayUsers.filter(u => u.userType === 'Doctor').length);
        studentsData.push(dayUsers.filter(u => u.userType === 'MedicalStudent').length);
        institutesData.push(dayUsers.filter(u => u.userType === 'EducationalInstitute').length);
        recruitersData.push(dayUsers.filter(u => u.userType === 'Recruiter').length);
      }
    } else if (timeRange === '3months' || timeRange === '6months' || timeRange === '12months') {
      // Monthly grouping
      const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth();
      for (let i = 0; i <= monthsDiff; i++) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        labels.push(monthStr);

        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);

        const monthUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= monthStart && userDate <= monthEnd;
        });

        doctorsData.push(monthUsers.filter(u => u.userType === 'Doctor').length);
        studentsData.push(monthUsers.filter(u => u.userType === 'MedicalStudent').length);
        institutesData.push(monthUsers.filter(u => u.userType === 'EducationalInstitute').length);
        recruitersData.push(monthUsers.filter(u => u.userType === 'Recruiter').length);
      }
    } else {
      // Yearly grouping for 'all' or custom ranges
      const yearsDiff = now.getFullYear() - startDate.getFullYear();
      for (let i = 0; i <= yearsDiff; i++) {
        const year = startDate.getFullYear() + i;
        labels.push(year.toString());

        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        yearEnd.setHours(23, 59, 59, 999);

        const yearUsers = filteredUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= yearStart && userDate <= yearEnd;
        });

        doctorsData.push(yearUsers.filter(u => u.userType === 'Doctor').length);
        studentsData.push(yearUsers.filter(u => u.userType === 'MedicalStudent').length);
        institutesData.push(yearUsers.filter(u => u.userType === 'EducationalInstitute').length);
        recruitersData.push(yearUsers.filter(u => u.userType === 'Recruiter').length);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Doctors',
          data: doctorsData,
          borderColor: colors.blue,
          backgroundColor: colors.blue + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Medical Students',
          data: studentsData,
          borderColor: colors.green,
          backgroundColor: colors.green + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Educational Institutes',
          data: institutesData,
          borderColor: colors.purple,
          backgroundColor: colors.purple + '20',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Recruiters',
          data: recruitersData,
          borderColor: colors.orange,
          backgroundColor: colors.orange + '20',
          tension: 0.4,
          fill: false
        }
      ]
    };
  };

  const registrationTrendsData = generateTimeBasedData(timeRange);

  // Generate Age Distribution Data
  const generateAgeDistributionData = () => {
    const doctors = allUsers.filter(user => user.userType === 'Doctor');
    const students = allUsers.filter(user => user.userType === 'MedicalStudent');

    // Age ranges
    const ageRanges = [
      { label: '18-25', min: 18, max: 25 },
      { label: '26-35', min: 26, max: 35 },
      { label: '36-45', min: 36, max: 45 },
      { label: '46-55', min: 46, max: 55 },
      { label: '56-65', min: 56, max: 65 },
      { label: '65+', min: 66, max: 100 }
    ];

    const doctorAgeData = ageRanges.map(range => {
      const count = doctors.filter(doctor => {
        const age = (doctor as any).age || 30; // Default age if not available
        return age >= range.min && age <= range.max;
      }).length;
      return count;
    });

    const studentAgeData = ageRanges.map(range => {
      const count = students.filter(student => {
        const age = (student as any).age || 22; // Default age if not available
        return age >= range.min && age <= range.max;
      }).length;
      return count;
    });

    return {
      labels: ageRanges.map(range => range.label),
      datasets: [
        {
          label: 'Doctors',
          data: doctorAgeData,
          backgroundColor: colors.blue + '80',
          borderColor: colors.blue,
          borderWidth: 2,
          fill: false
        },
        {
          label: 'Medical Students',
          data: studentAgeData,
          backgroundColor: colors.green + '80',
          borderColor: colors.green,
          borderWidth: 2,
          fill: false
        }
      ]
    };
  };

  const ageDistributionData = generateAgeDistributionData();

  // Generate Field of Study Distribution Data for Medical Students
  const generateFieldOfStudyData = () => {
    const medicalStudents = allUsers.filter(user => user.userType === 'MedicalStudent');

    // Group students by field of study
    const fieldData = medicalStudents.reduce((acc: any, student) => {
      const field = (student as any).fieldOfStudy || 'General Medicine';

      if (!acc[field]) {
        acc[field] = 0;
      }
      acc[field]++;
      return acc;
    }, {});

    // Sort by count (descending) and get top fields
    const sortedFields = Object.entries(fieldData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10); // Top 10 fields

    const labels = sortedFields.map(([field]) => field);
    const data = sortedFields.map(([, count]) => count as number);

    return {
      labels,
      datasets: [
        {
          label: 'Medical Students',
          data,
          borderColor: colors.purple,
          backgroundColor: colors.purple + '20',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.purple,
          pointBorderColor: colors.purple,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const fieldOfStudyData = generateFieldOfStudyData();

  // Generate Year of Study Distribution Data for Medical Students
  const generateYearOfStudyData = () => {
    const medicalStudents = allUsers.filter(user => user.userType === 'MedicalStudent');

    // Group students by year of study
    const yearData = medicalStudents.reduce((acc: any, student) => {
      const year = (student as any).yearOfStudy || 1; // Default to year 1 if not available

      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year]++;
      return acc;
    }, {});

    // Sort by year and ensure all years 1-5 are included
    const allYears = [1, 2, 3, 4, 5];
    const labels = allYears.map(year => `Year ${year}`);
    const data = allYears.map(year => yearData[year] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Medical Students',
          data,
          backgroundColor: colors.green + '80',
          borderColor: colors.green,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    };
  };

  const yearOfStudyData = generateYearOfStudyData();

  // Generate Institution Popularity Data
  const generateInstitutionPopularityData = () => {
    const doctors = allUsers.filter(user => user.userType === 'Doctor');
    const students = allUsers.filter(user => user.userType === 'MedicalStudent');

    // Group by institution
    const institutionData = allUsers.reduce((acc: any, user) => {
      const institution = (user as any).currentInstitute || (user as any).institution || 'Unknown';
      const userType = user.userType;

      if (!acc[institution]) {
        acc[institution] = {
          doctors: 0,
          students: 0,
          total: 0
        };
      }

      acc[institution].total++;
      if (userType === 'Doctor') {
        acc[institution].doctors++;
      } else if (userType === 'MedicalStudent') {
        acc[institution].students++;
      }
      return acc;
    }, {});

    // Sort by total count (descending) and get top institutions
    const sortedInstitutions = Object.entries(institutionData)
      .sort(([, a], [, b]) => (b as any).total - (a as any).total)
      .slice(0, 15); // Top 15 institutions

    const labels = sortedInstitutions.map(([institution]) => institution);
    const doctorsData = sortedInstitutions.map(([, data]) => (data as any).doctors);
    const studentsData = sortedInstitutions.map(([, data]) => (data as any).students);

    return {
      labels,
      datasets: [
        {
          label: 'Doctors',
          data: doctorsData,
          backgroundColor: colors.blue + '80',
          borderColor: colors.blue,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        },
        {
          label: 'Medical Students',
          data: studentsData,
          backgroundColor: colors.green + '80',
          borderColor: colors.green,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    };
  };

  const institutionPopularityData = generateInstitutionPopularityData();

  // Generate Doctor Specialties Data
  const generateDoctorSpecialtiesData = () => {
    const doctors = allUsers.filter(user => user.userType === 'Doctor');

    // Group doctors by specialty
    const specialtyData = doctors.reduce((acc: any, doctor) => {
      const specialty = (doctor as any).specialty || 'General Medicine';

      if (!acc[specialty]) {
        acc[specialty] = 0;
      }
      acc[specialty]++;
      return acc;
    }, {});

    // Sort by count (descending) and get all specialties
    const sortedSpecialties = Object.entries(specialtyData)
      .sort(([, a], [, b]) => (b as number) - (a as number));

    const labels = sortedSpecialties.map(([specialty]) => specialty);
    const data = sortedSpecialties.map(([, count]) => count as number);

    return {
      labels,
      datasets: [
        {
          label: 'Doctors',
          data,
          borderColor: colors.blue,
          backgroundColor: colors.blue + '20',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.blue,
          pointBorderColor: colors.blue,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const doctorSpecialtiesData = generateDoctorSpecialtiesData();

  // Generate Geographic Distribution of Doctors Data
  const generateDoctorGeoDistributionData = () => {
    const doctors = allUsers.filter(user => user.userType === 'Doctor');
    // Group by location
    const locationData = doctors.reduce((acc: any, doctor) => {
      const location = (doctor as any).location || 'Unknown';
      if (!acc[location]) acc[location] = 0;
      acc[location]++;
      return acc;
    }, {});
    // Sort by count descending, take top 15
    const sorted = Object.entries(locationData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 15);
    const labels = sorted.map(([loc]) => loc);
    const data = sorted.map(([, count]) => count as number);
    return {
      labels,
      datasets: [
        {
          label: 'Doctors',
          data,
          backgroundColor: colors.blue + '80',
          borderColor: colors.blue,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    };
  };

  const doctorGeoDistributionData = generateDoctorGeoDistributionData();

  // Generate Recruiter Organizations Data
  const generateRecruiterOrganizationsData = () => {
    const recruiters = allUsers.filter(user => user.userType === 'Recruiter');

    // Group recruiters by company type/organization
    const organizationData = recruiters.reduce((acc: any, recruiter) => {
      const companyType = (recruiter as any).companyType || (recruiter as any).organization || 'Unknown';

      if (!acc[companyType]) {
        acc[companyType] = 0;
      }
      acc[companyType]++;
      return acc;
    }, {});

    // Sort by count (descending) and get all company types
    const sortedOrganizations = Object.entries(organizationData)
      .sort(([, a], [, b]) => (b as number) - (a as number));

    const labels = sortedOrganizations.map(([organization]) => organization);
    const data = sortedOrganizations.map(([, count]) => count as number);

    return {
      labels,
      datasets: [
        {
          label: 'Recruiters',
          data,
          borderColor: colors.orange,
          backgroundColor: colors.orange + '20',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.orange,
          pointBorderColor: colors.orange,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const recruiterOrganizationsData = generateRecruiterOrganizationsData();

  // Generate Top 10 Institute Location Distribution Data
  const generateInstituteLocationData = () => {
    const institutes = allUsers.filter(user => user.userType === 'EducationalInstitute');

    // Group institutes by location
    const locationData = institutes.reduce((acc: any, institute) => {
      const location = (institute as any).location || 'Unknown';

      if (!acc[location]) {
        acc[location] = 0;
      }
      acc[location]++;
      return acc;
    }, {});

    // Sort by count (descending) and get top 10 locations
    const sortedLocations = Object.entries(locationData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10); // Top 10 locations

    const labels = sortedLocations.map(([location]) => location);
    const data = sortedLocations.map(([, count]) => count as number);

    return {
      labels,
      datasets: [
        {
          label: 'Educational Institutes',
          data,
          borderColor: colors.purple,
          backgroundColor: colors.purple + '20',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.purple,
          pointBorderColor: colors.purple,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const instituteLocationData = generateInstituteLocationData();

  // Most Common Job Types: Frequency of jobType
  const generateJobTypeFrequencyData = () => {
    if (!Array.isArray(allJobs)) return { labels: [], datasets: [] };
    const jobTypeData = allJobs.reduce((acc: any, job: any) => {
      const type = job.jobType || 'Unknown';
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
      return acc;
    }, {});
    const sorted = Object.entries(jobTypeData).sort(([, a], [, b]) => (b as number) - (a as number));
    const labels = sorted.map(([type]) => type);
    const data = sorted.map(([, count]) => count as number);
    return {
      labels,
      datasets: [
        {
          label: 'Jobs',
          data,
          borderColor: colors.purple, // dark blue
          backgroundColor: colors.purple + '90',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.indigo,
          pointBorderColor: colors.indigo,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };
  const jobTypeFrequencyData = generateJobTypeFrequencyData();

  // Department Demand: Count of jobs per department
  const generateDepartmentDemandData = () => {
    if (!Array.isArray(allJobs)) return { labels: [], datasets: [] };
    const deptData = allJobs.reduce((acc: any, job: any) => {
      const dept = job.department || 'Unknown';
      if (!acc[dept]) acc[dept] = 0;
      acc[dept]++;
      return acc;
    }, {});
    const sorted = Object.entries(deptData).sort(([, a], [, b]) => (b as number) - (a as number));
    const labels = sorted.map(([dept]) => dept);
    const data = sorted.map(([, count]) => count as number);
    return {
      labels,
      datasets: [
        {
          label: 'Jobs',
          data,
          borderColor: colors.cyan,
          backgroundColor: colors.cyan + '20',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.cyan,
          pointBorderColor: colors.cyan,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };
  const departmentDemandData = generateDepartmentDemandData();

  // Combined Department vs Job Type Line Chart
  const generateDeptJobTypeLineData = () => {
    if (!Array.isArray(allJobs)) return { labels: [], datasets: [] };
    // Get all unique departments and job types
    const departmentsSet = new Set<string>();
    const jobTypesSet = new Set<string>();
    allJobs.forEach((job: any) => {
      departmentsSet.add(job.department || 'Unknown');
      jobTypesSet.add(job.jobType || 'Unknown');
    });
    const departments = Array.from(departmentsSet);
    const jobTypes = Array.from(jobTypesSet);
    // Build a matrix: department x jobType
    const matrix: { [dept: string]: { [type: string]: number } } = {};
    departments.forEach(dept => {
      matrix[dept] = {};
      jobTypes.forEach(type => {
        matrix[dept][type] = 0;
      });
    });
    allJobs.forEach((job: any) => {
      const dept = job.department || 'Unknown';
      const type = job.jobType || 'Unknown';
      matrix[dept][type]++;
    });
    // Build datasets for each job type
    const colorList = [colors.indigo, colors.green, colors.orange, colors.blue, colors.purple, colors.red, colors.cyan, colors.teal, colors.yellow, colors.pink];
    const datasets = jobTypes.map((type, idx) => ({
      label: type,
      data: departments.map(dept => matrix[dept][type]),
      borderColor: colorList[idx % colorList.length],
      backgroundColor: colorList[idx % colorList.length] + '20',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: colorList[idx % colorList.length],
      pointBorderColor: colorList[idx % colorList.length],
      pointRadius: 6,
      pointHoverRadius: 8
    }));
    return {
      labels: departments,
      datasets
    };
  };
  const deptJobTypeLineData = generateDeptJobTypeLineData();

  // Generate detailed breakdown for expanded view
  const generateDetailedBreakdown = () => {
    if (!allUsers.length) return {
      totalRegistrations: 0,
      byUserType: {
        doctors: 0,
        students: 0,
        institutes: 0,
        recruiters: 0
      },
      byMonth: {},
      recentActivity: []
    };

    const breakdown = {
      totalRegistrations: allUsers.length,
      byUserType: {
        doctors: allUsers.filter(u => u.userType === 'Doctor').length,
        students: allUsers.filter(u => u.userType === 'MedicalStudent').length,
        institutes: allUsers.filter(u => u.userType === 'EducationalInstitute').length,
        recruiters: allUsers.filter(u => u.userType === 'Recruiter').length
      },
      byMonth: {} as any,
      recentActivity: [] as any[]
    };

    // Group by month
    allUsers.forEach(user => {
      const createdDate = new Date(user.createdAt);
      const monthKey = createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!breakdown.byMonth[monthKey]) {
        breakdown.byMonth[monthKey] = {
          total: 0,
          doctors: 0,
          students: 0,
          institutes: 0,
          recruiters: 0
        };
      }

      breakdown.byMonth[monthKey].total++;
      breakdown.byMonth[monthKey][user.userType.toLowerCase().replace('medicalstudent', 'students').replace('educationalinstitute', 'institutes')]++;
    });

    // Get recent activity (last 10 registrations)
    breakdown.recentActivity = allUsers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(user => ({
        email: user.email,
        userType: user.userType,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        location: user.location || 'N/A'
      }));

    return breakdown;
  };

  const detailedBreakdown = generateDetailedBreakdown();

  // User activity data with fallback
  const userActivityData: ChartData<'bar'> = {
    labels: ['Doctors', 'Medical Students', 'Educational Institutes', 'Recruiters'],
    datasets: [
      {
        label: 'Total Users',
        data: [
          counts.doctorCount || 0,
          counts.studentCount || 0,
          counts.instituteCount || 0,
          counts.recruiterCount || 0
        ],
        backgroundColor: colors.blue + '80',
        borderColor: colors.blue,
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Active Users (30 days)',
        data: [
          detailedStats?.activeUsers?.doctors || 0,
          detailedStats?.activeUsers?.students || 0,
          detailedStats?.activeUsers?.institutes || 0,
          detailedStats?.activeUsers?.recruiters || 0
        ],
        backgroundColor: colors.green + '80',
        borderColor: colors.green,
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // Check if active users data is available
  const hasActiveUsersData = detailedStats && detailedStats.activeUsers;
  const activeUsersData = [
    detailedStats?.activeUsers?.doctors || 0,
    detailedStats?.activeUsers?.students || 0,
    detailedStats?.activeUsers?.institutes || 0,
    detailedStats?.activeUsers?.recruiters || 0
  ];

  // Debug logging for chart data
  console.log('User Activity Chart Data:', {
    labels: ['Doctors', 'Medical Students', 'Educational Institutes', 'Recruiters'],
    totalUsers: [
      counts.doctorCount || 0,
      counts.studentCount || 0,
      counts.instituteCount || 0,
      counts.recruiterCount || 0
    ],
    activeUsers: activeUsersData,
    hasActiveUsersData: hasActiveUsersData,
    detailedStats: detailedStats
  });

  // Chart options
  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users'
        }
      },
      x: {
        title: {
          display: true,
          text: 'User Types'
        }
      }
    }
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Top 10 Locations and Department Demand in Jobs
  const generateLocationDepartmentLineData = () => {
    if (!Array.isArray(allJobs)) return { labels: [], datasets: [] };
    // Count jobs per location
    const locationCounts: Record<string, number> = {};
    allJobs.forEach((job: any) => {
      const loc = job.location || 'Unknown';
      if (!locationCounts[loc]) locationCounts[loc] = 0;
      locationCounts[loc]++;
    });
    // Get top 10 locations
    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([loc]) => loc);
    // Get all unique departments
    const departmentsSet = new Set<string>();
    allJobs.forEach((job: any) => {
      departmentsSet.add(job.department || 'Unknown');
    });
    const departments = Array.from(departmentsSet);
    // Build a matrix: location x department
    const matrix: { [loc: string]: { [dept: string]: number } } = {};
    topLocations.forEach(loc => {
      matrix[loc] = {};
      departments.forEach(dept => {
        matrix[loc][dept] = 0;
      });
    });
    allJobs.forEach((job: any) => {
      const loc = job.location || 'Unknown';
      const dept = job.department || 'Unknown';
      if (matrix[loc]) matrix[loc][dept]++;
    });
    // Build datasets for each department
    const colorList = [colors.indigo, colors.green, colors.orange, colors.blue, colors.purple, colors.red, colors.cyan, colors.teal, colors.yellow, colors.pink];
    const datasets = departments.map((dept, idx) => ({
      label: dept,
      data: topLocations.map(loc => matrix[loc][dept]),
      borderColor: colorList[idx % colorList.length],
      backgroundColor: colorList[idx % colorList.length] + '20',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: colorList[idx % colorList.length],
      pointBorderColor: colorList[idx % colorList.length],
      pointRadius: 6,
      pointHoverRadius: 8
    }));
    return {
      labels: topLocations,
      datasets
    };
  };

  const locationDepartmentLineData = generateLocationDepartmentLineData();

  // Generate actual monthly job posting trends from allJobs
  const generateJobPostingTrendsData = () => {
    if (!Array.isArray(allJobs)) return { labels: [], datasets: [] };
    // Get all unique job types
    const jobTypesSet = new Set<string>();
    allJobs.forEach((job: any) => {
      jobTypesSet.add(job.jobType || 'Unknown');
    });
    const jobTypes = Array.from(jobTypesSet);
    // Get all months in the data (YYYY-MM)
    const monthsSet = new Set<string>();
    allJobs.forEach((job: any) => {
      const date = new Date(job.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthsSet.add(month);
    });
    const months = Array.from(monthsSet).sort();
    // Build a matrix: month x jobType
    const matrix: { [month: string]: { [type: string]: number } } = {};
    months.forEach(month => {
      matrix[month] = {};
      jobTypes.forEach(type => {
        matrix[month][type] = 0;
      });
    });
    allJobs.forEach((job: any) => {
      const date = new Date(job.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const type = job.jobType || 'Unknown';
      if (matrix[month]) matrix[month][type]++;
    });
    // Build datasets for each job type
    const colorList = [colors.green, colors.orange, colors.blue, colors.purple, colors.red, colors.cyan, colors.teal, colors.yellow, colors.pink, colors.indigo];
    const datasets = jobTypes.map((type, idx) => ({
      label: type,
      data: months.map(month => matrix[month][type]),
      borderColor: colorList[idx % colorList.length],
      backgroundColor: colorList[idx % colorList.length] + '20',
      tension: 0.4,
      fill: false,
      pointBackgroundColor: colorList[idx % colorList.length],
      pointBorderColor: colorList[idx % colorList.length],
      pointRadius: 6,
      pointHoverRadius: 8
    }));
    // Format months for display (e.g., Jan 2024)
    const labels = months.map(m => {
      const [y, mo] = m.split('-');
      return new Date(Number(y), Number(mo) - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
    });
    return {
      labels,
      datasets
    };
  };
  const jobPostingTrendsData = generateJobPostingTrendsData();

  // Generate Platform Growth Trends for last 7 days
  const generatePlatformGrowthTrendsData = () => {
    if (!Array.isArray(allUsers) || !Array.isArray(allJobs)) {
      return { labels: [], datasets: [] };
    }

    // Get the last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    // Format dates for labels (e.g., "Mon 15")
    const labels = last7Days.map(date =>
      date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    );

    // Count job postings for each day
    const jobPostings = last7Days.map(date => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return allJobs.filter((job: any) => {
        const jobDate = new Date(job.createdAt);
        return jobDate >= startOfDay && jobDate <= endOfDay;
      }).length;
    });

    // Count user registrations for each day
    const userRegistrations = last7Days.map(date => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return allUsers.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return userDate >= startOfDay && userDate <= endOfDay;
      }).length;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Job Postings',
          data: jobPostings,
          borderColor: colors.blue,
          backgroundColor: colors.blue + '20',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: colors.blue,
          pointBorderColor: colors.blue,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: 'y'
        },
        {
          label: 'User Registrations',
          data: userRegistrations,
          borderColor: colors.green,
          backgroundColor: colors.green + '20',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: colors.green,
          pointBorderColor: colors.green,
          pointRadius: 6,
          pointHoverRadius: 8,
          yAxisID: 'y'
        }
      ]
    };
  };

  const platformGrowthTrendsData = generatePlatformGrowthTrendsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive reports and insights</p>
        </div>
        {/* <div className="flex gap-3">
          <button
            onClick={exportUserReport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export User Report
          </button>
          <button
            onClick={exportJobReport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Export Job Report
          </button>
        </div> */}
      </div>

      {/* Report Generator */}
      <ReportGenerator
        userData={allUsers}
        jobData={allJobs}
        stats={{ ...counts, ...jobCounts }}
        detailedStats={detailedStats}
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '' },
            { id: 'users', name: 'User Analytics', icon: '' },
            { id: 'jobs', name: 'Job Analytics', icon: '' },

          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobCounts.totalJobs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(detailedStats?.activeUsers?.doctors || 0) +
                      (detailedStats?.activeUsers?.students || 0) +
                      (detailedStats?.activeUsers?.institutes || 0) +
                      (detailedStats?.activeUsers?.recruiters || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">+15%</p>
                </div>
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">User Registration Trends</h3>

              {/* Time Range Selector */}
              <div className="mb-4 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                  <option value="all">All Time</option>
                </select>

                <button
                  onClick={() => setExpandedTrends(!expandedTrends)}
                  className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {expandedTrends ? 'Collapse' : 'Expand'} Details
                </button>
              </div>

              <Line data={registrationTrendsData} options={lineOptions} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Platform Growth Trends (Last 7 Days)</h3>
              <div className="h-80">
                <Line
                  data={platformGrowthTrendsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Daily Job Postings vs User Registrations'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Date'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Count'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-row gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-1/2  ">
                <h3 className="text-lg font-semibold mb-4">Field of Study Distribution (Medical Students)</h3>
                <div className="h-80">
                  <Line
                    data={fieldOfStudyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Top 10 Fields of Study for Medical Students'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} students`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Field of Study'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Students'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>





              {/* Year of Study Distribution Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-1/2">
                <h3 className="text-lg font-semibold mb-4">Doctor Specialties Distribution</h3>
                <div className="h-80">
                  <Line
                    data={doctorSpecialtiesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Distribution of Medical Specialties'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} doctors`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Medical Specialty'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Doctors'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md mb-6 ">
              <h3 className="text-lg font-semibold mb-4">Age Distribution of Doctors and Students</h3>
              <div className="h-120">
                <Bar
                  data={ageDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Age Distribution by User Type'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} users`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Age Range'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Users'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Department Demand Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6  ">
              <h3 className="text-lg font-semibold mb-4">Department Demand</h3>
              <div className="h-120">
                <Line
                  data={departmentDemandData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Count of Jobs Demand per Department'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} jobs`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Department'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Jobs'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>



          </div>





        </>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">User Distribution by Type</h3>

                {/* Debug info - keep this if you still need it */}
                {!hasActiveUsersData && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Active users data is not available. Check console for debugging information.
                    </p>
                  </div>
                )}

                <Bar
                  data={{
                    labels: ['Doctors', 'Medical Students', 'Institutes', 'Recruiters'],
                    datasets: [{
                      label: 'Total Users',
                      data: [
                        counts.doctorCount || 0,
                        counts.studentCount || 0,
                        counts.instituteCount || 0,
                        counts.recruiterCount || 0
                      ],
                      backgroundColor: [
                        'rgba(100, 149, 237, 0.6)',  // Cornflower Blue (light)
                        'rgba(100, 149, 237, 0.6)',  // Cornflower Blue (light)
                        'rgba(100, 149, 237, 0.6)',  // Cornflower Blue (light)
                        'rgba(100, 149, 237, 0.6)' // Light Gold
                      ],
                      borderColor: [
                        'rgba(100, 149, 237, 1)',
                        'rgba(100, 149, 237, 1)',
                        'rgba(100, 149, 237, 1)',
                        'rgba(100, 149, 237, 1)'
                      ],
                      borderWidth: 1,
                      borderRadius: 6
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `${context.parsed.y} users`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Users'
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />

                {/* Additional stats below the chart */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">Doctors</p>
                    <p className="text-xl font-bold text-blue-600">{counts.doctorCount || 0}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">Students</p>
                    <p className="text-xl font-bold text-green-600">{counts.studentCount || 0}</p>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-sm text-pink-800">Institutes</p>
                    <p className="text-xl font-bold text-pink-600">{counts.instituteCount || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">Recruiters</p>
                    <p className="text-xl font-bold text-yellow-600">{counts.recruiterCount || 0}</p>
                  </div>
                </div>
              </div>

              {/* Rest of your user analytics content... */}
            </div>
          )}


     



          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">User Registration Trends</h3>

              {/* Time Range Selector */}
              <div className="mb-4 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                  <option value="all">All Time</option>
                </select>

                <button
                  onClick={() => setExpandedTrends(!expandedTrends)}
                  className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {expandedTrends ? 'Collapse' : 'Expand'} Details
                </button>
              </div>

              <Line data={registrationTrendsData} options={lineOptions} />
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-1">Medical Student Trends</h2>
              <p className="text-sm text-gray-500 mb-4"> This group of charts displaying trends of medical students</p>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Field of Study Distribution (Medical Students)</h3>
                <div className="h-80">
                  <Line
                    data={fieldOfStudyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Top 10 Fields of Study for Medical Students'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} students`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Field of Study'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Students'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>








              <div className="bg-white p-6 rounded-lg shadow-md mb-6 ">
                <h3 className="text-lg font-semibold mb-4">Age Distribution of Doctors and Students</h3>
                <div className="h-120">
                  <Bar
                    data={ageDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Age Distribution by User Type'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} users`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Age Range'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Users'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>



                  {/* Year of Study Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Year of Study Distribution (Medical Students)</h3>
              <div className="h-80">
                <Bar
                  data={yearOfStudyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Student Distribution by Year of Study'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} students`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Year of Study'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Students'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            </div>



            {/* Institution Popularity Chart */}


            {/* Doctor Specialties Chart */}

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-1">Doctor Trends</h2>
              <p className="text-sm text-gray-500 mb-4"> This group of charts displaying trends of doctors</p>


              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Doctor Specialties Distribution</h3>
                <div className="h-80">
                  <Line
                    data={doctorSpecialtiesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Distribution of Medical Specialties'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} doctors`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Medical Specialty'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Doctors'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Geographic Distribution of Doctors Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Geographic Distribution of Doctors</h3>
                <div className="h-80">
                  <Bar
                    data={doctorGeoDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Top 15 Locations by Doctor Count'
                        },
                        legend: {
                          position: 'top' as const
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              return `${label}: ${value} doctors`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Location'
                          },
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Number of Doctors'
                          },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>


            </div>

            {/* Recruiter Organizations Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Recruiter Organizations</h3>
              <div className="h-80">
                <Line
                  data={recruiterOrganizationsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Distribution of Recruiter Organizations'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} recruiters`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Organization Type'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Recruiters'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Top 10 Institute Location Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Top 10 Institute Location Distribution</h3>
              <div className="h-80">
                <Line
                  data={instituteLocationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Top 10 Locations by Educational Institute Count'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} institutes`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Location'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Institutes'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

          </div>



          {/* Expanded Registration Trends Details */}
          {expandedTrends && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Detailed Registration Breakdown</h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">Total Registrations</p>
                  <p className="text-2xl font-bold text-blue-600">{detailedBreakdown.totalRegistrations}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">Doctors</p>
                  <p className="text-2xl font-bold text-green-600">{detailedBreakdown.byUserType?.doctors || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">Students</p>
                  <p className="text-2xl font-bold text-purple-600">{detailedBreakdown.byUserType?.students || 0}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800">Institutes</p>
                  <p className="text-2xl font-bold text-orange-600">{detailedBreakdown.byUserType?.institutes || 0}</p>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Monthly Registration Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left border">Month</th>
                        <th className="px-4 py-2 text-center border">Total</th>
                        <th className="px-4 py-2 text-center border">Doctors</th>
                        <th className="px-4 py-2 text-center border">Students</th>
                        <th className="px-4 py-2 text-center border">Institutes</th>
                        <th className="px-4 py-2 text-center border">Recruiters</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(detailedBreakdown.byMonth || {})
                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                        .map(([month, data]: [string, any]) => (
                          <tr key={month} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border font-medium">{month}</td>
                            <td className="px-4 py-2 border text-center">{data.total}</td>
                            <td className="px-4 py-2 border text-center">{data.doctors}</td>
                            <td className="px-4 py-2 border text-center">{data.students}</td>
                            <td className="px-4 py-2 border text-center">{data.institutes}</td>
                            <td className="px-4 py-2 border text-center">{data.recruiters}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-md font-semibold mb-3">Recent Registrations</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left border">Email</th>
                        <th className="px-4 py-2 text-left border">User Type</th>
                        <th className="px-4 py-2 text-left border">Location</th>
                        <th className="px-4 py-2 text-left border">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedBreakdown.recentActivity?.map((user: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">{user.email}</td>
                          <td className="px-4 py-2 border">{user.userType}</td>
                          <td className="px-4 py-2 border">{user.location}</td>
                          <td className="px-4 py-2 border">{user.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (

        <div className="space-y-6">
      

          {/* Combined Department vs Job Type Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Department vs Job Type Distribution</h3>
            <div className="h-150">
              <Line
                data={deptJobTypeLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Distribution of Jobs by Department and Type'
                    },
                    legend: {
                      position: 'top' as const
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.dataset.label || '';
                          const value = context.parsed.y;
                          return `${label}: ${value} jobs`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Department'
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Number of Jobs'
                      },
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>


          {/* Most Common Job Types Chart */}

          <div className="flex flex-row gap-6">


            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-1/2">
              <h3 className="text-lg font-semibold mb-4">Most Common Job Types</h3>
              <div className="h-100">
                <Bar
                  data={jobTypeFrequencyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Frequency of Job Types'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} jobs`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Job Type'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Jobs'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Department Demand Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-1/2">
              <h3 className="text-lg font-semibold mb-4">Department Demand</h3>
              <div className="h-100">
                <Line
                  data={departmentDemandData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Count of Jobs per Department'
                      },
                      legend: {
                        position: 'top' as const
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${value} jobs`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Department'
                        },
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Number of Jobs'
                        },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top 10 Locations and Department Demand in Jobs Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Top 10 Locations and Department Demand in Jobs</h3>
            <div className="h-130">
              <Line
                data={locationDepartmentLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Department Demand by Top 10 Job Locations'
                    },
                    legend: {
                      position: 'top' as const
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.dataset.label || '';
                          const value = context.parsed.y;
                          return `${label}: ${value} jobs`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Location'
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Number of Jobs'
                      },
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

        </div>







      )}




    </div>
  );
};

export default MedicalDashboard;