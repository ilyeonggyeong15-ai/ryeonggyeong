import React, { useState } from 'react';
import { Star, Trash2, ThumbsUp, ThumbsDown, Flame, Edit3, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GRADES = ['1학년', '2학년', '3학년', '4학년'];

const MyPageScreen = ({ onSelectRestaurant }) => {
  const { user, getUserReviews, deleteReview, updateProfile } = useApp();
  const myReviews = getUserReviews();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    nickname: user.nickname || user.name,
    grade: user.grade || '1학년',
  });
  
  // Custom delete state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleEdit = () => {
    setDraft({ nickname: user.nickname || user.name, grade: user.grade || '1학년' });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!draft.nickname.trim()) return;
    updateProfile({ nickname: draft.nickname.trim(), grade: draft.grade });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = (e, restaurantId, reviewId) => {
    e.stopPropagation();
    setDeleteTarget({ restaurantId, reviewId });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteReview(deleteTarget.restaurantId, deleteTarget.reviewId);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* ─── Profile Card ─── */}
      <div style={{
        background: 'linear-gradient(145deg, var(--primary-light) 0%, #ffffff 100%)',
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar bubble */}
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, #4D94FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,102,255,0.2)',
          }}>
            {(user.nickname || user.name)?.[0] || '냠'}
          </div>

          {/* Profile info or edit form */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isEditing ? (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Nickname input */}
                <input
                  id="profile-nickname-input"
                  type="text"
                  value={draft.nickname}
                  onChange={(e) => setDraft((d) => ({ ...d, nickname: e.target.value }))}
                  maxLength={16}
                  placeholder="닉네임을 입력하세요"
                  style={{
                    border: '1.5px solid var(--primary)',
                    borderRadius: 10,
                    padding: '6px 10px',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    outline: 'none',
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                />

                {/* University (locked) */}
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: '6px 10px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span>🏫</span>
                  <span>{user.university}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>변경 불가</span>
                </div>

                {/* Grade select */}
                <select
                  id="profile-grade-select"
                  value={draft.grade}
                  onChange={(e) => setDraft((d) => ({ ...d, grade: e.target.value }))}
                  style={{
                    border: '1.5px solid var(--primary)',
                    borderRadius: 10,
                    padding: '6px 10px',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    outline: 'none',
                    width: '100%',
                    backgroundColor: 'white',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                  }}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* Action row */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    id="profile-save-btn"
                    onClick={handleSave}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <Check size={14} /> 저장
                  </button>
                  <button
                    id="profile-cancel-btn"
                    onClick={handleCancel}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <X size={14} /> 취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>
                    {user.nickname || user.name}
                  </span>
                  <button
                    id="profile-edit-btn"
                    onClick={handleEdit}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                    }}
                    title="프로필 수정"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('모든 리뷰 데이터와 가입 설정을 초기화하고 처음 상태로 되돌리시겠습니까?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--danger)',
                      color: 'var(--danger)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    id="app-reset-btn"
                    title="앱 데이터 초기화"
                  >
                    데이터 초기화 🔄
                  </button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                  🏫 {user.university} · {user.grade}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        {!isEditing && (
          <div style={{
            display: 'flex',
            gap: 10,
            marginTop: 14,
            padding: '10px 0',
            borderTop: '1px solid var(--border-color)',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{myReviews.length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>리뷰</div>
            </div>
            <div style={{ width: 1, backgroundColor: 'var(--border-color)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{user.grade || '1학년'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>학년</div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Review List ─── */}
      <div style={{ flex: 1, padding: '12px 14px 80px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>
          내가 작성한 리뷰 {myReviews.length > 0 ? `(${myReviews.length})` : ''}
        </h3>

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

      {/* Custom Delete Confirm Modal */}
      {deleteTarget && (
        <div className="custom-alert-overlay" id="delete-confirm-modal">
          <div className="custom-alert-card" style={{ maxWidth: '280px', textAlign: 'center', padding: '20px 16px' }}>
            <div className="alert-icon-wrapper danger" style={{ margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={24} color="var(--danger)" />
            </div>
            <h4 className="alert-title" style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>리뷰 삭제</h4>
            <p className="alert-body" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
              정말 이 리뷰를 삭제하시겠습니까?<br />삭제된 리뷰는 복구할 수 없습니다.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="alert-btn-close"
                style={{ flex: 1, backgroundColor: 'var(--danger)', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'background-color 0.2s' }}
                onClick={confirmDelete}
                id="confirm-delete-yes"
              >
                삭제하기
              </button>
              <button
                className="alert-btn-close"
                style={{ flex: 1, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={cancelDelete}
                id="confirm-delete-no"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageScreen;
