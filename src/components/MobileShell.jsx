import React, { useState, useEffect } from 'react';
import { Home, User, Wifi, Signal, Battery } from 'lucide-react';

const MobileShell = ({ children, activeTab, setActiveTab, hideNavBar }) => {
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    // Update simulated mobile phone status bar time
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container fade-in">
      {/* Top Status Bar resembling an iPhone/Android status bar */}
      <div className="status-bar">
        <div>{time}</div>
        <div className="status-bar-icons">
          <Signal size={14} fill="currentColor" strokeWidth={1} />
          <Wifi size={14} />
          <Battery size={16} fill="currentColor" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main screen display */}
      <div className="screen-content custom-scroll">
        {children}
      </div>

      {/* Bottom Sticky Navigation (only shown if not in Splash/Start screen and not hidden) */}
      {activeTab !== 'start' && !hideNavBar && (
        <div className="nav-bar">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            id="nav-btn-home"
          >
            <Home size={22} />
            <span>홈</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'mypage' ? 'active' : ''}`}
            onClick={() => setActiveTab('mypage')}
            id="nav-btn-mypage"
          >
            <User size={22} />
            <span>마이페이지</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileShell;
