import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Star, AlertTriangle, X, Check } from 'lucide-react';
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

  const getDetectedProfanity = (text) => swearWords.find((word) => text.includes(word));

  const isIrrelevantReview = (text) => {
    // 1. 동일 문자 5회 이상 도배 (예: 아아아아아, ㅋㅋㅋㅋㅋ, ㅎㅎㅎㅎㅎ)
    if (/([ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9])\1{4,}/g.test(text)) return true;
    // 2. 자음이나 모음의 비율이 50% 이상인 경우 (무의미한 자모 도배)
    const hangulJamo = text.match(/[ㄱ-ㅎㅏ-ㅣ]/g) || [];
    if (hangulJamo.length > text.length * 0.5) return true;
    return false;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (content.length < 20) {
      setAlertMessage(`리뷰는 최소 20자 이상 작성해야 합니다. (현재 ${content.length}자)`);
      return;
    }

    if (isIrrelevantReview(content)) {
      setAlertMessage('음식점과 관련 없는 무의미한 텍스트 도배나 자음 도배(예: ㅋㅋㅋㅋ, 아아아아)는 등록하실 수 없습니다. 맛집 후기에 어울리는 성의 있는 리뷰를 남겨주세요.');
      return;
    }

    const badWord = getDetectedProfanity(content);
    if (badWord) {
      setAlertMessage(`작성하신 내용 중 비속어 [ ${badWord} ](이)가 감지되었습니다. 건전한 냠냠스쿨 문화를 위해 비속어를 지워주세요.`);
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

      {/* Sticky Header with Back Button and Top-Right Submit Button */}
      <div className="writer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="header-icon-btn" onClick={onBack} id="writer-back-btn">
          <ChevronLeft size={20} />
        </button>
        <span className="writer-header-title" style={{ fontSize: '15px', fontWeight: 800 }}>{restaurant.name} 리뷰</span>
        <button
          type="button"
          disabled={!isContentValid}
          onClick={handleSubmit}
          id="header-submit-btn"
          style={{
            background: 'none',
            border: 'none',
            color: isContentValid ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '14px',
            cursor: isContentValid ? 'pointer' : 'not-allowed',
            padding: '8px'
          }}
        >
          등록
        </button>
      </div>

      {/* Single-column scrollable form */}
      <form
        onSubmit={handleSubmit}
        className="custom-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* ── 1. Photo Uploader (At the Top) ── */}
        <div className="uploader-section">
          <span className="uploader-label" style={{ fontWeight: 700, fontSize: '13px' }}>사진 첨부 (최대 3장)</span>
          <div className="uploader-row" style={{ marginTop: '8px', display: 'flex', gap: 10 }}>
            {images.length < 3 && (
              <div
                className="uploader-btn-trigger"
                onClick={() => fileInputRef.current.click()}
                id="photo-upload-trigger"
                style={{ width: '72px', height: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', border: '1px dashed var(--border-color)', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '11px', gap: '4px' }}
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
              <div key={index} className="uploaded-thumb-wrapper" style={{ width: '72px', height: '72px', position: 'relative' }}>
                <img src={imgUrl} alt={`업로드 이미지 ${index + 1}`} className="uploaded-thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                <button
                  type="button"
                  className="thumb-remove-btn"
                  onClick={() => handleRemovePhoto(index)}
                  id={`remove-photo-${index}`}
                  style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justify: 'center', cursor: 'pointer' }}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. Review Content (Immediately Below Photo Uploader) ── */}
        <div className="writer-input-section">
          <span className="uploader-label" style={{ fontWeight: 700, fontSize: '13px' }}>리뷰 내용 작성</span>
          <textarea
            className="writer-textarea"
            placeholder="음식의 맛, 양, 분위기 등에 대한 솔직한 후기를 남겨주세요. (최소 20자 이상)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="review-content-textarea"
            style={{ minHeight: '120px', width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '13px', fontFamily: 'inherit', resize: 'none', marginTop: '8px' }}
          />
          <div className="writer-counter-row" style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ 
              color: isContentValid ? 'var(--success)' : 'var(--danger)', 
              fontSize: '11px', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              {isContentValid ? (
                <>✅ 등록 가능한 글자수입니다!</>
              ) : (
                <>⚠️ 20자 이상 입력 시 등록 가능합니다.</>
              )}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: isContentValid ? 'var(--success)' : 'var(--danger)' }}>
              {charCount}자 / 최소 20자
            </span>
          </div>
        </div>

        {/* ── 3. Star Rating ── */}
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
                  size={30}
                  fill={star <= rating ? '#FFB800' : 'none'}
                  color={star <= rating ? '#FFB800' : 'var(--border-color)'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. Quick Preset Tags ── */}
        <div className="quick-tags-section">
          <span className="quick-tags-title" style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)' }}>💡 자주 쓰이는 예시 문구 (클릭하여 입력)</span>
          <div className="quick-tags-list" style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {presetTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className="quick-tag-pill"
                onClick={() => handleAppendTag(tag)}
                id={`preset-tag-${tag.replace(/\s+/g, '-')}`}
                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Revisit Checkbox ── */}
        <div 
          className="revisit-section-checkbox" 
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px', backgroundColor: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', cursor: 'pointer' }} 
          onClick={() => setRevisit(!revisit)}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            border: '2px solid ' + (revisit ? 'var(--primary)' : 'var(--text-muted)'),
            backgroundColor: revisit ? 'var(--primary)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            color: 'white'
          }} id="revisit-checkbox">
            {revisit && <Check size={14} strokeWidth={3} />}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: revisit ? 'var(--text-main)' : 'var(--text-muted)' }}>
            다시 방문할 의사가 있습니다! (재방문)
          </span>
        </div>

        {/* ── 6. Submit Button (Right-Aligned) ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            type="submit"
            className="submit-btn"
            disabled={!isContentValid}
            id="submit-review-btn"
            style={{ 
              width: 'auto', 
              padding: '12px 28px', 
              borderRadius: '12px', 
              border: 'none', 
              backgroundColor: isContentValid ? 'var(--primary)' : 'var(--border-color)', 
              color: isContentValid ? 'white' : 'var(--text-muted)', 
              fontSize: '13px', 
              fontWeight: 800, 
              cursor: isContentValid ? 'pointer' : 'not-allowed',
              boxShadow: isContentValid ? 'var(--shadow-active)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            리뷰 등록하기
          </button>
        </div>
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
