import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const YourProfile = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 overflow-auto "> 
    <TopBar />
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 ">
     
     
     
      </div>
      </div>
</div>
  )
}

export default YourProfile