import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const NICKNAME_POOL = [
  '냠냠박사',
  '학식마스터',
  '제육수호자',
  '돈까스요정',
  '마라중독자',
  '커피수혈기',
  '밥도둑',
  '우주공강러',
  '동서대먹보',
  '프로혼밥러',
  '간식사냥꾼',
  '면식수행자',
  '대식가',
  '야식요정',
  '빵지순례자',
  '국밥러버'
];

const StartScreen = ({ onStart }) => {
  const { updateProfile } = useApp();
  const [nickname, setNickname] = useState('');
  const [grade, setGrade] = useState('1학년');

  // Randomly pick 4 initial nickname recommendations
  const [recommendations, setRecommendations] = useState(() => {
    return [...NICKNAME_POOL].sort(() => 0.5 - Math.random()).slice(0, 4);
  });

  const handleRefreshRecommendations = () => {
    setRecommendations([...NICKNAME_POOL].sort(() => 0.5 - Math.random()).slice(0, 4));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    
    // Save to global app context
    updateProfile({
      nickname: nickname.trim(),
      grade: grade,
      university: '동서대학교'
    });

    localStorage.setItem('yumyum_registered', 'true');
    onStart();
  };

  return (
    <div className="splash-wrapper slide-up" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      {/* Brand & Logo */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div className="splash-logo-container" style={{ margin: '0 auto 12px' }}>
          <img
            src="/logo.png"
            alt="냠냠스쿨 로고"
            className="splash-logo-img"
            style={{ width: '80px', height: '80px', borderRadius: '22px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.15)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>
        <h1 className="splash-title" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-1px', margin: 0 }}>냠냠스쿨</h1>
        <p className="splash-subtitle" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
          동서대학교 학생들을 위한 캠퍼스 주변 밥집 찾기
        </p>
      </div>

      {/* Profile Creation Form */}
      <form 
        onSubmit={handleSubmit}
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          padding: '18px 16px', 
          borderRadius: '24px', 
          boxShadow: 'var(--shadow-soft)', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '10px'
        }}
      >
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '2px' }}>
          반가워요! 프로필을 입력해 주세요 ✍️
        </h3>

        {/* Nickname Input & Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>닉네임</label>
          <input
            type="text"
            placeholder="원하는 닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={12}
            required
            id="start-nickname-input"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              fontSize: '13px',
              fontFamily: 'inherit',
              fontWeight: 600,
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: 'var(--bg-main)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          
          {/* Nickname recommendations pills */}
          <div style={{ marginTop: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>💡 추천 닉네임 (클릭 시 입력)</span>
              <button 
                type="button" 
                onClick={handleRefreshRecommendations}
                style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                새로고침 🔄
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {recommendations.map((rec) => (
                <button
                  type="button"
                  key={rec}
                  onClick={() => setNickname(rec)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: nickname === rec ? 'var(--primary-light)' : 'var(--bg-main)',
                    color: nickname === rec ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* University (Locked) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>학교</label>
          <input
            type="text"
            value="동서대학교"
            readOnly
            id="start-university-input"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: 'var(--text-muted)',
              backgroundColor: 'var(--border-color)',
              cursor: 'not-allowed'
            }}
          />
        </div>

        {/* Grade Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>학년</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            id="start-grade-select"
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              fontSize: '13px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: 'var(--text-main)',
              outline: 'none',
              backgroundColor: 'var(--bg-main)',
              cursor: 'pointer'
            }}
          >
            <option value="1학년">1학년</option>
            <option value="2학년">2학년</option>
            <option value="3학년">3학년</option>
            <option value="4학년">4학년</option>
          </select>
        </div>

        {/* Submit Start Button */}
        <button
          type="submit"
          className="splash-start-btn"
          disabled={!nickname.trim()}
          id="start-app-btn"
          style={{
            marginTop: '12px',
            width: '80%',
            alignSelf: 'center',
            backgroundColor: nickname.trim() ? 'var(--primary)' : 'var(--border-color)',
            cursor: nickname.trim() ? 'pointer' : 'not-allowed',
            boxShadow: nickname.trim() ? 'var(--shadow-active)' : 'none',
            color: nickname.trim() ? 'white' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '14px',
            padding: '11px',
            borderRadius: '14px',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          냠냠 밥집 보러가기
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
