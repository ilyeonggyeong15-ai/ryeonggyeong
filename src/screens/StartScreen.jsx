import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="splash-wrapper slide-up">
      <div className="splash-logo-container">
        <img
          src="/logo.png"
          alt="냠냠스쿨 로고"
          className="splash-logo-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";
          }}
        />
      </div>
      <h1 className="splash-title">냠냠스쿨</h1>
      <p className="splash-subtitle">
        냠냠대 학생들을 위한 캠퍼스 주변 숨은 밥집 찾기!<br />
        솔직한 리뷰부터 네이버 지도 위치, 영업시간까지 한눈에 확인해보세요.
      </p>
      <button className="splash-start-btn" onClick={onStart} id="start-app-btn">
        냠냠 밥집 보러가기
      </button>
    </div>
  );
};

export default StartScreen;
