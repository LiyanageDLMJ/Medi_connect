import { FaUniversity, FaClock, FaMapMarkerAlt, FaMoneyBillAlt } from "react-icons/fa";
import PropTypes from 'prop-types';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {degrees.map((degree) => (
          <div key={degree.id} className="bg-gray-100 shadow-lg rounded-lg p-6 transition duration-300 hover:bg-blue-200 hover:shadow-xl">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded">
                {degree.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{degree.name}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaUniversity className="text-gray-500" /> {degree.institution}
                </p>
              </div>
            </div>

            <div className="mt-4 text-gray-600">
              <p className="flex items-center gap-2">
                <FaClock className="text-gray-500" /> {degree.duration}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" /> {degree.location}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillAlt className="text-gray-500" /> {degree.tuition}
              </p>
            </div>

            <span className={`inline-block mt-3 px-3 py-1 text-white text-sm font-semibold rounded ${degree.statusColor}`}>
              {degree.status}
            </span>
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
    })
  ).isRequired,
  totalDegrees: PropTypes.number.isRequired,
};

export default DegreeCard;
