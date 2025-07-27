

import  { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import FiltersBar from "../components/insights/FiltersBar";
import PopularCoursesChart from "../components/insights/PopularCoursesChart";
import ApplicationTrendsChart from "../components/insights/ApplicationTrendsChart";
import DemographicsChart from "../components/insights/DemographicsChart";
import EnrollmentFunnelChart from "../components/insights/EnrollmentFunnelChart";
import ProgramFillRate from "../components/insights/ProgramFillRate";
import ApplicationDeadlineImpactChart from "../components/insights/ApplicationDeadlineImpactChart";

const PerformanceInsights: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [courseType, setCourseType] = useState("All");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-0 ">
        <TopBar />
        <div className="flex items-center justify-between mb-2 px-8">
          <h1 className="text-3xl font-bold">Performance Insights</h1>
          <div className="min-w-[250px] flex-shrink-0 pt-3">
            <div >
              <FiltersBar
                dateRange={dateRange}
                setDateRange={setDateRange}
                courseType={courseType}
                setCourseType={setCourseType}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <PopularCoursesChart dateRange={dateRange} />
            <ApplicationTrendsChart dateRange={dateRange} courseType={courseType} />
            <DemographicsChart dateRange={dateRange} />
            <ApplicationDeadlineImpactChart courseType={courseType} />
            <EnrollmentFunnelChart dateRange={dateRange} courseType={courseType} />
            <ProgramFillRate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;