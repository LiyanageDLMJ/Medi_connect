import  { useEffect, useState } from "react";

type FiltersBarProps = {
  dateRange: string;
  setDateRange: (v: string) => void;
  courseType: string;
  setCourseType: (v: string) => void;
};

const FiltersBar: React.FC<FiltersBarProps> = ({
  dateRange, setDateRange,
  courseType, setCourseType
}) => {
  const [courseOptions, setCourseOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/higherDegrees/insights/course-list')
      .then(res => res.json())
      .then(data => setCourseOptions(data))
      .catch(() => setCourseOptions([]));
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
        {courseOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default FiltersBar; 