import React, { useState, useEffect } from 'react';
import { Home, User, Wifi, Signal, Battery } from 'lucide-react';

const MobileShell = ({ children, activeTab, setActiveTab, hideNavBar }) => {
  const [time, setTime] = useState('12:00');

  useEffect(() => {
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
      {/* Phone Status Bar */}
      <div className="status-bar">
        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{time}</span>

        <div className="status-bar-icons">
          <Signal size={13} fill="currentColor" strokeWidth={1} />
          <Wifi size={13} />
          <Battery size={15} fill="currentColor" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main scrollable content area */}
      <div className="screen-content custom-scroll">
        {children}
      </div>

      {/* Bottom Phone Tab Navigation */}
      {activeTab !== 'start' && !hideNavBar && (
        <div className="nav-bar">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            id="nav-btn-home"
          >
            <Home size={20} />
            <span>홈</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'mypage' ? 'active' : ''}`}
            onClick={() => setActiveTab('mypage')}
            id="nav-btn-mypage"
          >
            <User size={20} />
            <span>마이냠냠</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileShell;
