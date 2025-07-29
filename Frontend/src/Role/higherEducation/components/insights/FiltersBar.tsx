import React, { useEffect, useState } from "react";

type FiltersBarProps = {
  dateRange: string;
  setDateRange: (v: string) => void;
  courseType: string;
  setCourseType: (v: string) => void;
  applicantType?: string;
  setApplicantType?: (v: string) => void;
};

const FiltersBar: React.FC<FiltersBarProps> = ({
  dateRange, setDateRange,
  courseType, setCourseType,
  applicantType = "All", setApplicantType
}) => {
  const [courseOptions, setCourseOptions] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('FiltersBar - Token exists:', !!token);
    console.log('FiltersBar - Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
    
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('FiltersBar - Making request to course-list with headers:', headers);
    
    fetch('http://localhost:3000/higherDegrees/insights/course-list', { headers })
      .then(res => {
        console.log('FiltersBar - Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('FiltersBar - Course list data:', data);
        setCourseOptions(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('FiltersBar - Error:', error);
        setCourseOptions([]);
      });
  }, []);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border rounded p-2">
        <option>Last 30 days</option>
        <option>Last Semester</option>
        <option>Last Year</option>
      </select>
      <select value={courseType} onChange={e => setCourseType(e.target.value)} className="border rounded p-2">
        <option>All</option>
        {courseOptions.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>{option}</option>
        ))}
      </select>
      {setApplicantType && (
        <select value={applicantType} onChange={e => setApplicantType(e.target.value)} className="border rounded p-2">
          <option>All</option>
          <option value="MedicalStudent">Medical Student</option>
          <option value="Doctor">Professional Doctor</option>
        </select>
      )}
    </div>
  );
};

export default FiltersBar; 