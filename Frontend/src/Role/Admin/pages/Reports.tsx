import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
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

// Type for color palette
interface ColorPalette {
  blue: string;
  indigo: string;
  purple: string;
  pink: string;
  rose: string;
  amber: string;
  emerald: string;
  teal: string;
  cyan: string;
  sky: string;
}

const MedicalDashboard: React.FC = () => {
  // Color palette with type annotation
  const colors: ColorPalette = {
    blue: '#3B82F6',
    indigo: '#6366F1',
    purple: '#8B5CF6',
    pink: '#EC4899',
    rose: '#F43F5E',
    amber: '#F59E0B',
    emerald: '#10B981',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    sky: '#0EA5E9'
  };

  // 1. Job Listings by Specialty (Pie Chart)
  const specialtyData: ChartData<'pie'> = {
    labels: ['Physiotherapist', 'Cardiologist', 'Pulmonologist', 'Endocrinologist'],
    datasets: [{
      data: [15, 22, 8, 12],
      backgroundColor: [
        colors.pink,
        colors.rose,
        colors.amber,
        colors.purple
      ],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // 2. User Count by Type (Bar Chart)
  const userData: ChartData<'bar'> = {
    labels: ['Doctors', 'Medical Students', 'Institutes', 'Recruiters'],
    datasets: [{
      label: 'User Count',
      data: [145, 89, 32, 27],
      backgroundColor: [
        colors.blue,
        colors.emerald,
        colors.indigo,
        colors.teal
      ],
      borderRadius: 6
    }]
  };

  // 3. Job Types (Pie Chart)
  const jobTypeData: ChartData<'pie'> = {
    labels: ['Cardiologist', 'Pediatrician', 'General Physician', 'ENT Specialist', 'Anesthesiologist'],
    datasets: [{
      data: [18, 14, 22, 9, 7],
      backgroundColor: [
        colors.sky,
        colors.cyan,
        colors.amber,
        colors.purple,
        colors.pink
      ],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  // 4. Employment Type (Donut Chart)
  const employmentData: ChartData<'pie'> = {
    labels: ['Full Time', 'Part Time'],
    datasets: [{
      data: [80, 20],
      backgroundColor: [
        colors.emerald,
        colors.amber
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };

  // 5. Field of Study (Horizontal Bar Chart)
  const studyData: ChartData<'bar'> = {
    labels: ['Biomedicine', 'Dentistry', 'Anatomy', 'Clinical Chemistry', 'General Medicine'],
    datasets: [{
      label: 'Students',
      data: [45, 32, 28, 19, 56],
      backgroundColor: [
        colors.indigo,
        colors.purple,
        colors.pink,
        colors.rose,
        colors.blue
      ],
      borderRadius: 4
    }]
  };

  // Chart options with TypeScript types
  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  const horizontalBarOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: { beginAtZero: true }
    }
  };

  const donutOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to  Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total User */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-gray-500 text-sm font-medium mb-2">
              Total User
            </h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">40,689</p>
            <p className="text-green-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              8.5% Up from yesterday
            </p>
          </div>

          {/* Total Doctors */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-gray-500 text-sm font-medium mb-2">
              Total Doctors
            </h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">10,293</p>
            <p className="text-green-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              1.3% Up from past week
            </p>
          </div>

          {/* Total Students */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-gray-500 text-sm font-medium mb-2">
              Total Students
            </h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">$89,000</p>
            <p className="text-red-500 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              4.3% Down from yesterday
            </p>
          </div>

          
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Job Listings by Specialty */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Listings by Specialty</h2>
          <div className="h-96">
            <Pie 
              data={specialtyData}
              options={pieOptions}
            />
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User Distribution</h2>
          <div className="h-64">
            <Bar 
              data={userData}
              options={barOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Job Types */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Types</h2>
          <div className="h-64">
            <Pie 
              data={jobTypeData}
              options={pieOptions}
            />
          </div>
        </div>

        {/* Employment Type */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Employment Type</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
              <Pie 
                data={employmentData}
                options={donutOptions}
              />
            </div>
            <div className="ml-4 text-center">
              <p className="text-4xl font-bold text-gray-800">68%</p>
              <p className="text-emerald-600">Full Time</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">32%</p>
              <p className="text-amber-500">Part Time</p>
            </div>
          </div>
        </div>

        {/* Field of Study */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Medical Students by Field</h2>
          <div className="h-64">
            <Bar 
              data={studyData}
              options={horizontalBarOptions}
            />
          </div>
        </div>
      </div>


      <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Latest User List</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                   
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* NGO */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    NGO
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Christine Brooks
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    089 Kutch Green Apt. 448
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    04 Sep 2019
                  </td>
                   
                   
                </tr>

            
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
};

export default MedicalDashboard;