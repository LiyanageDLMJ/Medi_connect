import React from "react";
import { FiGlobe } from "react-icons/fi";

const TopBar: React.FC = () => {
  return (
    <div className="flex justify-end items-center p-2 pb-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FiGlobe className="text-gray-600" />
          <span className="text-gray-600">English</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            ABC
          </div>
          <span className="text-gray-600">ABC Institute</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;