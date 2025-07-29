
import Sidebar from "../components/Sidebar";

const InstitutionDashboard: React.FC = () => {
  console.log('InstitutionDashboard component is rendering!');
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: '256px', padding: '20px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px', 
          backgroundColor: 'white',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
            Educational Institution Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6B7280' }}>Welcome, Institution!</span>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)',
          padding: '48px 24px',
          borderRadius: '12px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1F2937', 
            marginBottom: '24px' 
          }}>
            Educational Institutions
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#374151', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Connect with aspiring medical students and showcase your advanced programs worldwide.
          </p>
        </div>

        {/* Welcome Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '32px', 
          borderRadius: '12px', 
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1E3A8A', 
            marginBottom: '24px' 
          }}>
            Welcome to MediConnect
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: '#4B5563', 
            lineHeight: '1.7' 
          }}>
            At MediConnect, we specialize in bridging the gap between medical professionals, students, recruiters, and
            institutions through an innovative digital platform. Whether you're an educational institution looking to
            attract top medical students, a recruiter sourcing talent, or a student seeking opportunities, MediConnect
            is your go-to hub for smart academic management and global networking.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1E3A8A', 
              marginBottom: '16px' 
            }}>
              1. Program Management
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Post and manage your degree programs with detailed information and requirements.
              Reach a global audience of medical students and professionals.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1E3A8A', 
              marginBottom: '16px' 
            }}>
              2. Application Management
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Review and manage student applications efficiently with our streamlined tracking system.
              Access comprehensive student profiles and academic records.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1E3A8A', 
              marginBottom: '16px' 
            }}>
              3. Student Communication
            </h3>
            <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
              Communicate directly with prospective students through our secure messaging system.
              Stay informed with instant notifications on new applications and inquiries.
            </p>
      <div className="flex-1 overflow-auto md:ml-64 bg-gray-50">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Welcome, {profile.name || 'Educational Institution'}!</h1>
              <p className="text-gray-600 text-xl mt-2">{profile.userType ? `Role: ${profile.userType}` : 'Manage your programs, connect with students, and post opportunities.'}</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div style={{ 
          backgroundColor: '#FEF3C7', 
          border: '1px solid #F59E0B', 
          padding: '16px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#92400E', margin: 0 }}>
            ✅ Dashboard is working! This is the Educational Institution Dashboard with the same design theme as other dashboards.
          </p>
          <div className="bg-yellow-100 rounded-xl p-8 max-w-4xl">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Institution Tools</h2>
            <ul className="text-yellow-700 text-lg space-y-2">
              <li>• Post and manage degree programs</li>
              <li>• Review student applications</li>
              <li>• Communicate with prospective students</li>
              <li>• Track program statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
