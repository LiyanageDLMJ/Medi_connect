import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MessageBox from '../../../Components/MessageBox/MessageBox';

const Messages = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:pl-64"> {/* Add padding on larger screens to account for sidebar */}
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)]">
          <MessageBox />
        </div>
      </div>
    </div>
  )
}

export default Messages