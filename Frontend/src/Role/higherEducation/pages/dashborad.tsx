import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";


const Dashborad = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafd 0%, #e3eafc 100%)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', padding: '2.5rem 1rem' }}>
        <TopBar />
        <div style={{ width: '100%', maxWidth: 900, marginTop: 32 }}>
          {/* Main content goes here */}
        </div>
      </div>
    </div>
  )
}

export default Dashborad