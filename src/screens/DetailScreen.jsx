import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Star, MapPin, Clock, Phone, Plus, Minus, 
  ThumbsUp, ThumbsDown, X, Flame, PenTool
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DetailScreen = ({ restaurantId, onBack, onWriteReview }) => {
  const { restaurants, getRatingStats } = useApp();
  
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return (
      <div className="no-reviews-msg">
        가게를 찾을 수 없습니다.
        <button onClick={onBack} className="alert-btn-close">돌아가기</button>
      </div>
    );
  }

  const { rating, count } = getRatingStats(restaurant);

  // 1. Photo Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = restaurant.images.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [slideCount]);

  // 2. Map Simulator Interactive State
  const [zoom, setZoom] = useState(1.5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setMapOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - mapOffset.x,
        y: e.touches[0].clientY - mapOffset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setMapOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));

  // 3. Reviews Filter & Sorting States
  const [sortBy, setSortBy] = useState('popular');
  const [photoOnly, setPhotoOnly] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredReviews = restaurant.reviews.filter((rev) => {
    if (photoOnly) return rev.images && rev.images.length > 0;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    return new Date(b.date) - new Date(a.date);
  });

  const allPhotos = [];
  restaurant.reviews.forEach((rev) => {
    if (rev.images && rev.images.length > 0) {
      rev.images.forEach((img) => {
        allPhotos.push({ imgUrl: img, reviewId: rev.id, author: rev.author, date: rev.date });
      });
    }
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky Top Header */}
      <div className="detail-header" style={{ flexShrink: 0 }}>
        <button className="header-icon-btn" onClick={onBack} id="detail-back-btn">
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {restaurant.name}
        </span>
        <div style={{ width: '36px' }} />
      </div>

      {/* Scrollable portrait content */}
      <div className="custom-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>

        {/* Photo Carousel */}
        <div className="carousel-container" style={{ borderRadius: 0, height: 200 }}>
          {restaurant.images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`${restaurant.name} 사진 ${index + 1}`}
              className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
              }}
            />
          ))}
          <div className="carousel-indicators">
            {restaurant.images.map((_, index) => (
              <div
                key={index}
                className={`indicator-dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* Title & Rating */}
        <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="detail-title" style={{ fontSize: 18 }}>{restaurant.name}</h2>
            <div className="detail-category-row">
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{restaurant.category}</span>
              <span>•</span>
              <span>정문 기준 {restaurant.distance}m</span>
            </div>
          </div>
          <div className="detail-rating-huge">
            <span className="detail-rating-val">{rating > 0 ? rating : '0.0'}</span>
            <span className="detail-rating-lbl">평점 ({count})</span>
          </div>
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)', margin: '0 16px 14px', fontWeight: 500 }}>
          {restaurant.description}
        </p>

        {/* Info Details */}
        <div className="info-details-list" style={{ margin: '0 16px 14px' }}>
          <div className="info-item">
            <Clock size={15} className="info-item-icon" />
            <div className="info-item-content">
              <div className="info-item-label">영업시간</div>
              <div className="info-item-value">{restaurant.hours}</div>
            </div>
          </div>
          <div className="info-item">
            <MapPin size={15} className="info-item-icon" />
            <div className="info-item-content">
              <div className="info-item-label">가게 위치</div>
              <div className="info-item-value">{restaurant.address}</div>
            </div>
          </div>
          {restaurant.phone && (
            <div className="info-item">
              <Phone size={15} className="info-item-icon" />
              <div className="info-item-content">
                <div className="info-item-label">전화번호</div>
                <div className="info-item-value">{restaurant.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Simulated Naver Map */}
        <div
          className="map-container-mock"
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          id="naver-map-simulator"
          style={{ margin: '0 16px 14px', borderRadius: 16 }}
        >
          <div
            className="map-bg-grid"
            style={{
              transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
              backgroundSize: `${35 * zoom}px ${35 * zoom}px`
            }}
          />
          <div
            className="map-marker"
            style={{
              transform: `translate(${mapOffset.x + (restaurant.mapCoords.x * 200 * zoom)}px, ${mapOffset.y + (restaurant.mapCoords.y * 200 * zoom)}px)`
            }}
          >
            <div className="map-marker-pin" />
            <div className="map-marker-label">{restaurant.name}</div>
          </div>
          <div className="naver-logo-watermark">
            <div className="naver-logo-circle" />
            <span>NAVER 지도</span>
          </div>
          <div className="map-control-zoom">
            <button className="map-zoom-btn" onClick={zoomIn} id="map-zoom-in">+</button>
            <button className="map-zoom-btn" onClick={zoomOut} id="map-zoom-out">-</button>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ padding: '0 16px' }}>
          <div className="reviews-section-header" style={{ marginBottom: 10 }}>
            <h3 className="reviews-title">리뷰 ({count})</h3>
            <div
              className="photo-only-toggle"
              onClick={() => setPhotoOnly(!photoOnly)}
              id="photo-reviews-only-toggle"
            >
              <span>사진 리뷰만</span>
              <div className={`toggle-switch ${photoOnly ? 'active' : ''}`}>
                <div className="toggle-handle" />
              </div>
            </div>
          </div>

          {!photoOnly && (
            <div className="reviews-filter-tabs" style={{ marginBottom: 10 }}>
              <button
                className={`tab-btn ${sortBy === 'popular' ? 'active' : ''}`}
                onClick={() => setSortBy('popular')}
                id="review-sort-popular"
              >
                인기순
              </button>
              <button
                className={`tab-btn ${sortBy === 'latest' ? 'active' : ''}`}
                onClick={() => setSortBy('latest')}
                id="review-sort-latest"
              >
                최신순
              </button>
            </div>
          )}

          {photoOnly ? (
            allPhotos.length > 0 ? (
              <div className="photo-reviews-grid">
                {allPhotos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo.imgUrl}
                    alt={`리뷰사진-${photo.author}`}
                    className="grid-photo-item"
                    onClick={() => setLightboxImage(photo.imgUrl)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150";
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="no-reviews-msg">업로드된 사진 리뷰가 없습니다. 📷</div>
            )
          ) : (
            sortedReviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sortedReviews.map((rev) => (
                  <div key={rev.id} className="review-item-card slide-up">
                    <div className="review-user-row">
                      <div className="review-user-meta">
                        <div className="review-user-avatar">{rev.avatar || rev.author[0]}</div>
                        <div>
                          <div className="review-user-name">{rev.author}</div>
                          <div className="review-user-date">{rev.date}</div>
                        </div>
                      </div>
                      <div className={`review-revisit-tag ${rev.revisit ? 'yes' : 'no'}`}>
                        {rev.revisit ? (
                          <>
                            <ThumbsUp size={11} fill="currentColor" />
                            <span>재방문 의사 있음</span>
                          </>
                        ) : (
                          <>
                            <ThumbsDown size={11} fill="currentColor" />
                            <span>이번만 갈래요</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          fill={star <= Math.round(rev.rating) ? "#FFB800" : "none"}
                          color={star <= Math.round(rev.rating) ? "#FFB800" : "var(--border-color)"}
                        />
                      ))}
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginLeft: 4 }}>
                        {rev.rating}
                      </span>
                    </div>

                    <p className="review-body-text">{rev.content}</p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="review-images-row">
                        {rev.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="리뷰 첨부 이미지"
                            className="review-img-thumb"
                            onClick={() => setLightboxImage(img)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100";
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={11} fill="currentColor" color="var(--primary)" />
                        <span>추천 {rev.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews-msg">첫 번째 리뷰를 남겨보세요! ✍️</div>
            )
          )}
        </div>
      </div>

      {/* Floating Review Writer Button */}
      <button
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '16px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(0, 102, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 15
        }}
        onClick={onWriteReview}
        id="write-review-fab"
      >
        <PenTool size={20} />
      </button>

      {/* Picture Zoom Modal */}
      {lightboxImage && (
        <div className="lightbox-modal" onClick={() => setLightboxImage(null)} id="image-lightbox-modal">
          <button className="lightbox-close-btn" onClick={() => setLightboxImage(null)}>
            <X size={18} />
          </button>
          <img src={lightboxImage} alt="확대 보기" className="lightbox-content" />
        </div>
      )}
    </div>
  );
};

export default DetailScreen;
