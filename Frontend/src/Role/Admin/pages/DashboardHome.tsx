import React from "react";

const DashboardHome = () => {
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-full">
      
        <h2 className="text-3xl font-bold text-gray-800 mb-8 ">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Total recruiters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-gray-500 text-sm font-medium mb-2">
              Total recruiters
            </h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">2,040</p>
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
              1.8% Up from yesterday
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Role</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RECRUITER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LOCATION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    INTERVIEW MODE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Online
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>

                {/* Telemedicine */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Telemedicine
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rosie Pearson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    979 Immanuel Ferry Suite 526
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    28 May 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Online
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>

                {/* Specialized */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Specialized
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Darrell Caldwell
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    8587 Frida Ports
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    23 Nov 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Online
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                  </td>
                </tr>

                {/* Specialized */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Specialized
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Gilbert Johnston
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    768 Destiny Lake Suite 600
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    05 Feb 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    In-Person
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>

                {/* Telemedicine */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Telemedicine
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Alan Cain
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    042 Mylene Throughway
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    29 Jul 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Online
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>

                {/* Medical Intern */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Medical Intern
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Alfred Murray
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    543 Weimann Mountain
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    15 Aug 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    In-Person
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>

                {/* Resident Physician */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Resident Physician
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Maggie Sullivan
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    New Scottleberg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    21 Dec 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Online
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>

                {/* Resident Physician */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Resident Physician
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rosie Todd
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    New Jon
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    30 Apr 2019
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    In-Person
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rejected
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
