import Sidebar from "../components/Sidebar";
import MessageBox from '../../../Components/MessageBox/MessageBox';

const Messages = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div style={{ flex: '0 0 250px', height: '100vh' }}>
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-64"> {/* Add margin on larger screens to account for sidebar */}
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
          <MessageBox />
        </div>
      </div>
    </div>
  )
}

export default Messages