import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";


const Dashborad = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-64 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            {/* Main content goes here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashborad