import { FaUniversity, FaClock, FaMoneyBillAlt, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Degree {
  courseId: number;
  degreeName: string;
  institution: string;
  duration: string;
  mode: string;
  tuitionFee: string;
  status: string;
  statusColor: string;
  image?: string;
}

interface DegreeCardProps {
  degrees: Degree[];
  totalDegrees: number;
}

const DegreeCard: React.FC<DegreeCardProps> = ({ degrees, totalDegrees }) => {
  const getImagePath = (imagePath?: string): string => {
    if (!imagePath) {
      return "/assets/images/default-image.jpg";
    }
    const cleanedPath = imagePath.replace(/^\/image\//, "");
    return `http://localhost:3000/image/${cleanedPath}`;
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">
        Showing <span className="text-blue-600">{degrees.length}</span> of total{" "}
        <span className="text-blue-600">{totalDegrees}</span> Degree Programs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {degrees.map((degree) => (
          <div key={degree.courseId} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="relative">
              <img
                src={getImagePath(degree.image)}
                alt={degree.degreeName}
                className="w-full h-48 object-cover rounded-lg pt-4 px-4 pb-0 bg-white"
                onError={(e) => (e.currentTarget.src = "/assets/images/default-image.jpg")}
              />
              <span className={`absolute top-5 right-6 px-3 py-1 text-white text-sm font-semibold rounded ${degree.statusColor}`}>
                {degree.status.toLowerCase()}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-bold">{degree.degreeName}</h5>
                <button className="px-3 py-1 text-sm bg-gray-200 rounded">Details</button>
              </div>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FaUniversity className="text-gray-500" /> {degree.institution}
              </p>
              <div className="mt-4 text-gray-600 text-sm grid grid-cols-3 gap-2">
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-gray-500" /> {degree.mode}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-gray-500" /> {degree.duration}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillAlt className="text-gray-500" /> {degree.tuitionFee}
                </p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Link
                to="/physician/degreeapplication"
                state={{
                  degree: { 
                    name: degree.degreeName, 
                    institution: degree.institution 
                  },
                  degreeId: degree.courseId 
                }}
              >
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  Apply →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DegreeCard;