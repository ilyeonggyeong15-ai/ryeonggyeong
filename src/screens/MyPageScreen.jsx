import React from 'react';
import { Star, Trash2, ThumbsUp, ThumbsDown, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MyPageScreen = ({ onSelectRestaurant }) => {
  const { user, getUserReviews, deleteReview } = useApp();
  const myReviews = getUserReviews();

  const handleDelete = (e, restaurantId, reviewId) => {
    e.stopPropagation(); // Stop navigation click
    if (window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      deleteReview(restaurantId, reviewId);
    }
  };

  return (
    <div className="split-layout" style={{ height: '100%' }}>
      {/* Left Column: Profile Card */}
      <div className="split-left" style={{ 
        background: 'linear-gradient(180deg, var(--primary-light) 0%, var(--bg-main) 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div className="profile-avatar-huge">
          {user.avatar}
        </div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-sub">{user.university}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
          {user.department}
        </p>

        {/* Statistics grid row */}
        <div className="profile-stats-row" style={{ marginTop: '20px', width: '100%', maxWidth: '240px' }}>
          <div className="stat-item" style={{ flex: 1 }}>
            <span className="stat-val">{myReviews.length}개</span>
            <span className="stat-lbl">남긴 리뷰</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div className="stat-item" style={{ flex: 1 }}>
            <span className="stat-val">{user.favoriteCategory}</span>
            <span className="stat-lbl">최애 분야</span>
          </div>
        </div>
      </div>

      {/* Right Column: User Reviews list scroll */}
      <div className="split-right custom-scroll">
        <h3 className="my-reviews-title-row">내가 작성한 리뷰 모음</h3>

        <div className="my-reviews-list">
          {myReviews.length > 0 ? (
            myReviews.map((rev) => (
              <div
                key={rev.id}
                className="my-review-card slide-up"
                onClick={() => onSelectRestaurant(rev.restaurantId)}
                id={`my-review-card-${rev.id}`}
              >
                <div className="my-review-header">
                  <div>
                    <span className="my-review-target-name">{rev.restaurantName}</span>
                    <span style={{
                      fontSize: '10px',
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary-light)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      marginLeft: '6px',
                      fontWeight: 700
                    }}>
                      {rev.restaurantCategory}
                    </span>
                  </div>
                  <button
                    className="delete-review-btn"
                    onClick={(e) => handleDelete(e, rev.restaurantId, rev.id)}
                    title="리뷰 삭제"
                    id={`delete-review-btn-${rev.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Stars and revisit tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={11}
                        fill={star <= Math.round(rev.rating) ? "#FFB800" : "none"}
                        color={star <= Math.round(rev.rating) ? "#FFB800" : "var(--border-color)"}
                      />
                    ))}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginLeft: 4 }}>
                      {rev.rating}
                    </span>
                  </div>

                  <div className={`review-revisit-tag ${rev.revisit ? 'yes' : 'no'}`} style={{ transform: 'scale(0.8)', transformOrigin: 'right center' }}>
                    {rev.revisit ? (
                      <>
                        <ThumbsUp size={10} fill="currentColor" />
                        <span>재방문 의사 있음</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown size={10} fill="currentColor" />
                        <span>이번만 갈래요</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="review-body-text" style={{ fontSize: '11px', marginTop: 2 }}>
                  {rev.content}
                </p>

                {/* Image attachments */}
                {rev.images && rev.images.length > 0 && (
                  <div className="review-images-row" style={{ marginTop: 2 }}>
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="첨부 이미지"
                        className="review-img-thumb"
                        style={{ width: '42px', height: '42px', borderRadius: '6px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=80";
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Footer details */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontSize: '10px', 
                  color: 'var(--text-muted)', 
                  fontWeight: 600, 
                  borderTop: '1px dashed var(--border-color)', 
                  paddingTop: 6, 
                  marginTop: 2 
                }}>
                  <span>작성일: {rev.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Flame size={10} fill="currentColor" color="var(--primary)" />
                    <span>추천 {rev.likes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews-msg">아직 남기신 리뷰가 없습니다. ✏️</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageScreen;
