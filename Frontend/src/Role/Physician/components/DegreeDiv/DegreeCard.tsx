import { FaUniversity, FaClock, FaMoneyBillAlt, FaGlobe } from "react-icons/fa";
import PropTypes from "prop-types";

interface Degree {
  id: number;
  name: string;
  institution: string;
  duration: string;
  location: string;
  type: string;
  tuition: string;
  status: string;
  statusColor: string;
  image?: string;
}

interface DegreeCardProps {
  degrees: Degree[];
  totalDegrees: number;
}

const DegreeCard: React.FC<DegreeCardProps> = ({ degrees, totalDegrees }) => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">
        Showing <span className="text-blue-600">{degrees.length}</span> of total{" "}
        <span className="text-blue-600">{totalDegrees}</span> Degree Programs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {degrees.map((degree) => (
          <div key={degree.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            {/* Image Section with Status Badge */}
            <div className="relative">

  <img src={degree.image} alt={degree.name} className="w-full h-48 object-cover rounded-lg pt-4 px-4 pb-0 bg-white" />

              <span className={`absolute top-5 right-6 px-3 py-1 text-white text-sm font-semibold rounded ${degree.statusColor}`}>
                {degree.status.toLowerCase()}
              </span>
            </div>

            {/* Course Details */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h5  className="text-lg  font-bold">{degree.name}</h5>
                <button className="px-3 py-1 text-sm bg-gray-200 rounded">Details</button>
              </div>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FaUniversity className="text-gray-500" /> {degree.institution}
              </p>

              {/* Icons for Program Info */}
              <div className="mt-4 text-gray-600 text-sm grid grid-cols-3 gap-2">
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-gray-500" /> {degree.type}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-gray-500" /> {degree.duration}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-gray-500" /> {degree.tuition}
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t flex justify-end">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                Apply →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DegreeCard.propTypes = {
  degrees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      institution: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      tuition: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      statusColor: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  totalDegrees: PropTypes.number.isRequired,
};

export default DegreeCard;
