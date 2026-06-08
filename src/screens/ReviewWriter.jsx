import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, ThumbsUp, ThumbsDown, Star, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const ReviewWriter = ({ restaurantId, onBack }) => {
  const { restaurants, addReview } = useApp();
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [revisit, setRevisit] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  const fileInputRef = useRef(null);

  if (!restaurant) {
    return <div className="no-reviews-msg">가게를 찾을 수 없습니다.</div>;
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setAlertMessage('사진은 최대 3장까지만 업로드할 수 있습니다.');
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const presetTags = [
    '혼밥하기 좋아요.',
    '양이 진짜 많아요.',
    '가성비 최고예요.',
    '음식이 빨리 나와요.',
    '매장이 청결해요.',
    '친절하고 서비스가 좋아요.'
  ];

  const handleAppendTag = (tagText) => {
    setContent((prev) => {
      if (!prev) return tagText;
      return prev.endsWith(' ') ? `${prev}${tagText}` : `${prev} ${tagText}`;
    });
  };

  const swearWords = [
    '시발', '씨발', '개새끼', '존나', '병신', '미친', '지랄',
    '호로', '엿먹', '꺼져', '빡치', '새끼', '샹놈', '썅'
  ];

  const checkProfanity = (text) => swearWords.some((word) => text.includes(word));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.length < 20) {
      setAlertMessage('리뷰는 최소 20자 이상 작성해야 합니다.');
      return;
    }

    if (checkProfanity(content)) {
      setAlertMessage('작성하신 리뷰에 욕설이 포함되어 있어 등록할 수 없습니다. 건전한 냠냠스쿨 문화를 위해 욕설을 지워주세요.');
      return;
    }

    addReview(restaurant.id, { rating, content, images, revisit });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

    onBack();
  };

  const charCount = content.length;
  const isContentValid = charCount >= 20;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Sticky Header */}
      <div className="writer-header">
        <button className="header-icon-btn" onClick={onBack} id="writer-back-btn">
          <ChevronLeft size={20} />
        </button>
        <span className="writer-header-title">{restaurant.name} 리뷰</span>
        <div style={{ width: '36px' }} />
      </div>

      {/* Single-column scrollable form */}
      <form
        onSubmit={handleSubmit}
        className="custom-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* ── Star Rating ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0', backgroundColor: 'var(--bg-card)', borderRadius: 16, boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>이 밥집은 몇 점인가요?</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                id={`rating-star-${star}`}
              >
                <Star
                  size={32}
                  fill={star <= rating ? '#FFB800' : 'none'}
                  color={star <= rating ? '#FFB800' : 'var(--border-color)'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Review Content ── */}
        <div className="writer-input-section">
          <span className="uploader-label">리뷰 내용 작성</span>
          <textarea
            className="writer-textarea"
            placeholder="음식의 맛, 양, 분위기 등에 대한 솔직한 후기를 남겨주세요. (최소 20자 이상)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="review-content-textarea"
            style={{ minHeight: '100px' }}
          />
          <div className="writer-counter-row" style={{ marginTop: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>공백 포함 최소 20자</span>
            <span className={`writer-counter ${isContentValid ? 'valid' : 'invalid'}`}>
              {charCount} / 20자
            </span>
          </div>
        </div>

        {/* ── Quick Preset Tags ── */}
        <div className="quick-tags-section">
          <span className="quick-tags-title">💡 자주 쓰이는 예시 문구 (클릭하여 입력)</span>
          <div className="quick-tags-list" style={{ marginTop: '6px' }}>
            {presetTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="quick-tag-pill"
                onClick={() => handleAppendTag(tag)}
                id={`preset-tag-${tag.replace(/\s+/g, '-')}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Photo Uploader ── */}
        <div className="uploader-section">
          <span className="uploader-label">사진 첨부 (최대 3장)</span>
          <div className="uploader-row" style={{ marginTop: '6px' }}>
            {images.length < 3 && (
              <div
                className="uploader-btn-trigger"
                onClick={() => fileInputRef.current.click()}
                id="photo-upload-trigger"
                style={{ width: '72px', height: '72px' }}
              >
                <Camera size={20} />
                <span>{images.length}/3</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            {images.map((imgUrl, index) => (
              <div key={index} className="uploaded-thumb-wrapper" style={{ width: '72px', height: '72px' }}>
                <img src={imgUrl} alt={`업로드 이미지 ${index + 1}`} className="uploaded-thumb" />
                <button
                  type="button"
                  className="thumb-remove-btn"
                  onClick={() => handleRemovePhoto(index)}
                  id={`remove-photo-${index}`}
                >
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Revisit Option ── */}
        <div className="revisit-section">
          <span className="uploader-label">재방문 의사가 있으신가요?</span>
          <div className="revisit-options" style={{ marginTop: '8px' }}>
            <div
              className={`revisit-option-card yes ${revisit ? 'selected' : ''}`}
              onClick={() => setRevisit(true)}
              id="revisit-yes-card"
            >
              <ThumbsUp size={20} fill={revisit ? 'currentColor' : 'none'} />
              <span>다시 올래요!</span>
            </div>
            <div
              className={`revisit-option-card no ${!revisit ? 'selected' : ''}`}
              onClick={() => setRevisit(false)}
              id="revisit-no-card"
            >
              <ThumbsDown size={20} fill={!revisit ? 'currentColor' : 'none'} />
              <span>이번만 갈래요</span>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          className="submit-btn"
          disabled={!isContentValid}
          id="submit-review-btn"
          style={{ marginTop: 'auto' }}
        >
          리뷰 등록하기
        </button>
      </form>

      {/* Warning popup alert */}
      {alertMessage && (
        <div className="custom-alert-overlay" id="validation-alert-modal">
          <div className="custom-alert-card">
            <div className="alert-icon-wrapper danger">
              <AlertTriangle size={24} />
            </div>
            <h4 className="alert-title">안내</h4>
            <p className="alert-body">{alertMessage}</p>
            <button
              className="alert-btn-close"
              onClick={() => setAlertMessage(null)}
              id="close-validation-alert-btn"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewWriter;
