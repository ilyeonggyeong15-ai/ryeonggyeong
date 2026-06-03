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
      {/* Top Browser / Application Frame Status Bar */}
      <div className="status-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>● 냠냠스쿨</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{time}</span>
        </div>
        
        {/* Mock browser address bar indicating the university campus coordinates */}
        <div style={{ 
          backgroundColor: 'var(--bg-main)', 
          padding: '4px 20px', 
          borderRadius: '12px', 
          fontSize: '11px', 
          color: 'var(--text-muted)', 
          border: '1px solid var(--border-color)', 
          width: '280px', 
          textAlign: 'center',
          fontWeight: 600,
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          https://yumyum.school/campus/busan-sashang
        </div>

        <div className="status-bar-icons">
          <Signal size={14} fill="currentColor" strokeWidth={1} />
          <Wifi size={14} />
          <Battery size={16} fill="currentColor" strokeWidth={1.5} />
        </div>
      </div>

      {/* 16:9 Main View Content Area */}
      <div className="screen-content custom-scroll">
        {children}
      </div>

      {/* Bottom Widescreen Navigation tabs */}
      {activeTab !== 'start' && !hideNavBar && (
        <div className="nav-bar">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            id="nav-btn-home"
          >
            <Home size={18} />
            <span>홈 피드</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'mypage' ? 'active' : ''}`}
            onClick={() => setActiveTab('mypage')}
            id="nav-btn-mypage"
          >
            <User size={18} />
            <span>마이 냠냠</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileShell;
