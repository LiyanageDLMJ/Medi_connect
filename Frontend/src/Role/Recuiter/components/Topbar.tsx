import  { useState, useRef, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from '../../../Components/Notification/NotificationDropdown';
import { socket } from '../../../lib/socket';

const TopBar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
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

      // Try /auth/me first
      if (token) {
        console.log('TopBar - Making request to /auth/me with token');
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('TopBar - /auth/me response status:', res.status);
        if (res.ok) {
          userData = await res.json();
          console.log('TopBar - User data received:', userData);
        } else {
          console.error('TopBar - /auth/me request failed:', res.status, res.statusText);
        }
      }

      // If /auth/me fails or is missing fields, try /auth/by-email/:email
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
          const res2 = await fetch(`http://localhost:3000/auth/by-email/${encodeURIComponent(email)}`);
          if (res2.ok) {
            const userByEmail = await res2.json();
            userData = { ...userData, ...userByEmail }; // Merge fields
          }
        }
      }

      if (userData) {
        setUser(userData);
        // Store userId for consistency - handle both id and _id
        const userId = userData._id || userData.id;
        if (userId) {
          localStorage.setItem('userId', userId);
          // Fetch unread notification count
          fetchUnreadCount(userId);
          // Join user's notification room
          socket.emit('join_notification_room', userId);
        }
      }
    };
    fetchUser();
  }, []);

  // Socket.io real-time notification listeners
  useEffect(() => {
    if (!user) return;

    const userId = user._id || user.id;

    // Listen for new notifications
    const handleNewNotification = (data: { notification: any; unreadCount: number }) => {
      console.log('New notification received:', data);
      setUnreadCount(data.unreadCount);
      
      // Show a toast notification
      if (data.notification) {
        showToastNotification(data.notification.title, data.notification.message);
      }
    };

    // Listen for notification updates (mark as read, delete, etc.)
    const handleNotificationUpdate = (data: { type: string; unreadCount: number; notificationId?: string }) => {
      console.log('Notification update received:', data);
      setUnreadCount(data.unreadCount);
    };

    // Join user's notification room
    socket.emit('join_notification_room', userId);

    // Add event listeners
    socket.on('new_notification', handleNewNotification);
    socket.on('notification_updated', handleNotificationUpdate);

    // Cleanup
    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_updated', handleNotificationUpdate);
      socket.emit('leave_notification_room', userId);
    };
  }, [user]);

  const fetchUnreadCount = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/notifications/${userId}/unread`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const showToastNotification = (title: string, message: string) => {
    // Create a simple toast notification with translucent background
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-500/90 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-2xl z-50 max-w-sm border border-blue-400/30';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm opacity-90">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

  const handleLogout = () => {
    // Leave notification room before logout
    if (user) {
      const userId = user._id || user.id;
      socket.emit('leave_notification_room', userId);
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    setDropdownOpen(false); // Close profile dropdown if open
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Recruiter Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              aria-label="Notifications"
              className="relative focus:outline-none"
              ref={bellRef}
              onClick={handleNotificationClick}
            >
              <FiBell className="text-gray-600 text-2xl hover:text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">{user?.userType}</p>
            </div>
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=E0E7FF&color=3730A3&size=96&rounded=true`
              }
              alt="avatar"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=E0E7FF&color=3730A3&size=96&rounded=true`;
              }}
            />
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notification Dropdown - Positioned absolutely outside TopBar */}
      {notificationDropdownOpen && user && (
        <div className="absolute top-16 right-4 z-50">
          <NotificationDropdown
            isOpen={notificationDropdownOpen}
            onClose={() => setNotificationDropdownOpen(false)}
            userId={user._id || user.id}
          />
        </div>
      )}
    </>
  );
};

export default TopBar;
