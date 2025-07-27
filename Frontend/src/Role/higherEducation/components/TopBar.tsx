import  { useState, useRef, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TopBar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      let userData = null;

      // Try /api/me first
      if (token) {
        const res = await fetch('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          userData = await res.json();
        }
      }

      // If /api/me fails or is missing fields, try /by-email/:email
      if (!userData || !userData.name || !userData.profilePic) {
        let email = localStorage.getItem('userEmail');
        if (!email) {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              email = JSON.parse(userStr).email;
            } catch {}
          }
        }
        if (email) {
          const res2 = await fetch(`http://localhost:3000/by-email/${encodeURIComponent(email)}`);
          if (res2.ok) {
            const userByEmail = await res2.json();
            userData = { ...userData, ...userByEmail }; // Merge fields
          }
        }
      }

      if (userData) setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="flex justify-end items-center p-2 pb-2 bg-white shadow-md">
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="relative focus:outline-none"
            ref={bellRef}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <FiBell className="text-gray-600 text-2xl hover:text-blue-600" />
          </button>
        </div>
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <select className="text-sm text-gray-700 focus:outline-none bg-white" defaultValue="en" style={{ minWidth: 60 }}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="si">Sinhala</option>
          </select>
        </div>
        {/* Profile Section */}
        <div
          className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=E0E7FF&color=3730A3&size=96&rounded=true`
            }
            alt="avatar"
            className="w-9 h-9 rounded-full border border-gray-300 object-cover"
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=E0E7FF&color=3730A3&size=96&rounded=true`;
            }}
          />
          <div className="flex flex-col items-start justify-center">
            <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || user?.email}</span>
            <span className="text-xs text-gray-500">{user?.userType}</span>
          </div>
          <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          {dropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-12 w-40 bg-white border rounded shadow z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;