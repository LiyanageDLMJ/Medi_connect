import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
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
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
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

  // 1. Job Listings by Specialty (Pie Chart)
  




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

 
  const [allUsers, setAllUsers] = useState({
    email:String,
    userType:String,
    location:String,
    specialty:String,
    createdAt:String,
    updatedAt:String,
    
    
  });




  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/users/count")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user counts");
        return res.json();
      })
      .then((data) => setCounts(data))
      .catch((err) => setError(err.message));
  }, []);


  useEffect(() => {
    fetch("http://localhost:3000/api/admin/jobCount")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job counts");
        return res.json();
      })
      .then((data) => setJobCounts(data))
      .catch((err) => setError(err.message));
  }, []);


  useEffect(() => {
    fetch("http://localhost:3000/api/admin/allUsers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch All Users");
        return res.json();
      })
      .then((data) => setAllUsers(data))
      .catch((err) => setError(err.message));
  }, []);
 


  const specialtyData: ChartData<'pie'> = {
    labels: ['Pediatrician', 'Cardiologist', 'GeneralPhysician', 'Pulmonologist', 'Endocrinologist'],
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

  // 2. User Count by Type (Bar Chart)
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

  // 3. Job Types (Pie Chart)
  const jobTypeData: ChartData<'pie'> = {
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
      hoverOffset: 12
    }]
  };

  // 4. Employment Type (Donut Chart)
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

  //  Field of Study  
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

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const horizontalBarOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: { 
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  const donutOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Dashboard</h1>
        <p className="text-gray-600 mb-8">Overview of medical professionals and students</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total User */}
          <div className="bg-white p-6  rounded-xl shadow-sm   py-8 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-gray-500 text-sm font-medium mb-2">Total Users</h2>
                <p className="text-2xl font-bold text-gray-800 mb-2">{counts.total}</p>
                <p className="text-green-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  8.5% Up from yesterday
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white p-6 rounded-xl shadow-sm   py-8 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-gray-500 text-sm font-medium mb-2">Total Doctors</h2>
                <p className="text-2xl font-bold text-gray-800 mb-2">{counts.doctorCount}</p>
                <p className="text-green-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  1.3% Up from past week
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-white p-6 rounded-xl shadow-sm   py-8 border-amber-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-gray-500 text-sm font-medium mb-2">Total Students</h2>
                <p className="text-2xl font-bold text-gray-800 mb-2">{counts.studentCount}</p>
                <p className="text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  4.3% Down from yesterday
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Doctors Listings by Specialty */}
          <div className="bg-white p-6 rounded-xl px-10 shadow-lg">
           <div>
           <h2 className="text-xl font-semibold mb-4 text-gray-700">Doctors Listings by Specialty</h2>
            <div className="h-96">
              <Pie data={specialtyData} options={pieOptions} />
            </div>
           </div>
          </div>

          {/* Medical Students by Field */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Medical Students by Field</h2>
            <div className="h-80">
              <Bar data={studyData} options={horizontalBarOptions} />
            </div>
          </div>
        </div>

        {/* User Distribution Full Width */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User Distribution</h2>
          <div className="h-96">
            <Bar data={userData} options={barOptions} />
          </div>
        </div>

        {/* Bottom Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Job Types */}
          <div className="bg-white p-6 px-10 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Types</h2>
            <div className="h-96">
              <Pie data={jobTypeData} options={pieOptions} />
            </div>
          </div>

          {/* Employment Type */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Employment Type</h2>
            <div className="flex flex-col lg:flex-row items-center justify-center h-80">
              <div className="w-64 h-64">
                <Pie data={employmentData} options={donutOptions} />
              </div>
              <div className="lg:ml-8 mt-4 lg:mt-0 text-center lg:text-left">
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-lg font-medium text-gray-700">Full Time</p>
                  <p className="ml-2 text-xl font-bold text-gray-800">{jobCounts.fullTimeCount}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <p className="text-lg font-medium text-gray-700">Part Time</p>
                  <p className="ml-2 text-xl font-bold text-gray-800">  {jobCounts.partTimeCount}</p>
                </div>
                <div className="flex items-center mt-3">
                  <div className="w-4 h-4 rounded-full  bg-blue-500 mr-2"></div>
                  <p className="text-lg font-medium text-gray-700">Internship</p>
                  <p className="ml-2 text-xl font-bold text-gray-800">{jobCounts.internCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>






        {/* Latest User List */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Latest Users</h3>
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">CB</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Christine Brooks</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">christine@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Doctor</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York, USA</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">04 Sep 2023</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">JM</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">John Michael</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Student</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">London, UK</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">02 Sep 2023</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">AS</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Alexa Smith</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">alexa@example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">Institute</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Berlin, Germany</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01 Sep 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;