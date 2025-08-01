import React from "react";
import { FiGlobe } from "react-icons/fi";
import { MdLocalHospital } from "react-icons/md";

const TopBar: React.FC = () => {
  return (
    <div className="flex justify-end items-center p-4 pb-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FiGlobe className="text-gray-600" />
          <span className="text-gray-600">English</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
            <MdLocalHospital />
          </div>
          <span className="text-gray-600">Healing Hands Hospital</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
