import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Star, MapPin, Clock, Phone, Plus, Minus, 
  ThumbsUp, ThumbsDown, Camera, X, MessageSquare, PenTool, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DetailScreen = ({ restaurantId, onBack, onWriteReview }) => {
  const { restaurants, getRatingStats } = useApp();
  
  // Find the selected restaurant
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return (
      <div className="no-reviews-msg">
        가게를 찾을 수 없습니다.
        <button onClick={onBack} className="alert-btn-close">돌아가기</button>
      </div>
    );
  }

  // Dynamic rating statistics
  const { rating, count } = getRatingStats(restaurant);

  // 1. Photo Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = restaurant.images.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  // Auto-scroll slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [slideCount]);

  // 2. Map Simulator Interactive State
  const [zoom, setZoom] = useState(1.5); // zoom multiplier
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  // Handle map drag/pan
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

  // Touch support for mobile users
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

  // Zoom Actions
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));

  // 3. Reviews Filter & Sorting States
  const [sortBy, setSortBy] = useState('popular'); // 'popular' or 'latest'
  const [photoOnly, setPhotoOnly] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Sorting & Filtering logic for reviews
  const filteredReviews = restaurant.reviews.filter((rev) => {
    if (photoOnly) {
      return rev.images && rev.images.length > 0;
    }
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes; // Most likes first
    } else {
      return new Date(b.date) - new Date(a.date); // Newest first
    }
  });

  // Extract all review photos for the "photo only" view
  const allPhotos = [];
  restaurant.reviews.forEach((rev) => {
    if (rev.images && rev.images.length > 0) {
      rev.images.forEach((img) => {
        allPhotos.push({
          imgUrl: img,
          reviewId: rev.id,
          author: rev.author,
          date: rev.date
        });
      });
    }
  });

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      {/* Top Header Overlay with Back Arrow */}
      <div className="detail-header">
        <button className="header-icon-btn" onClick={onBack} id="detail-back-btn">
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white', fontSize: '16px' }}>
          밥집 상세
        </span>
        <div style={{ width: '36px' }}></div> {/* Spacer */}
      </div>

      {/* Image Slider / Carousel */}
      <div className="carousel-container">
        {restaurant.images.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`${restaurant.name} 슬라이드 ${index + 1}`}
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
            }}
          />
        ))}

        {/* Carousel Slide Indicators */}
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

      {/* Restaurant Introduction Details */}
      <div className="detail-info-card">
        <div className="detail-main-info">
          <div>
            <h2 className="detail-title">{restaurant.name}</h2>
            <div className="detail-category-row">
              <span>{restaurant.category}</span>
              <span>•</span>
              <span>정문에서 도보 {restaurant.distance}m</span>
            </div>
          </div>
          <div className="detail-rating-huge">
            <span className="detail-rating-val">{rating > 0 ? rating : '0.0'}</span>
            <span className="detail-rating-lbl">평점 ({count})</span>
          </div>
        </div>

        {/* Key Info List */}
        <div className="info-details-list">
          <div className="info-item">
            <Clock size={16} className="info-item-icon" />
            <div className="info-item-content">
              <div className="info-item-label">영업시간</div>
              <div className="info-item-value">{restaurant.hours}</div>
            </div>
          </div>

          <div className="info-item">
            <MapPin size={16} className="info-item-icon" />
            <div className="info-item-content">
              <div className="info-item-label">위치</div>
              <div className="info-item-value">{restaurant.address}</div>
            </div>
          </div>

          {restaurant.phone && (
            <div className="info-item">
              <Phone size={16} className="info-item-icon" />
              <div className="info-item-content">
                <div className="info-item-label">전화번호</div>
                <div className="info-item-value">{restaurant.phone}</div>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)', padding: '4px 0' }}>
          {restaurant.description}
        </p>

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
        >
          {/* Grid lines moving with offsets */}
          <div 
            className="map-bg-grid" 
            style={{ 
              transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
              backgroundSize: `${35 * zoom}px ${35 * zoom}px`
            }} 
          />

          {/* Marker reflecting mapOffset and custom coordinates */}
          <div 
            className="map-marker"
            style={{
              transform: `translate(${mapOffset.x + (restaurant.mapCoords.x * 200 * zoom)}px, ${mapOffset.y + (restaurant.mapCoords.y * 200 * zoom)}px)`
            }}
          >
            <div className="map-marker-pin" />
            <div className="map-marker-label">{restaurant.name}</div>
          </div>

          {/* Naver Maps watermarks and controls */}
          <div className="naver-logo-watermark">
            <div className="naver-logo-circle" />
            <span>NAVER 지도</span>
          </div>

          <div className="map-control-zoom">
            <button className="map-zoom-btn" onClick={zoomIn} id="map-zoom-in">+</button>
            <button className="map-zoom-btn" onClick={zoomOut} id="map-zoom-out">-</button>
          </div>
        </div>

        {/* Reviews Section Header & Controls */}
        <div className="reviews-section-header">
          <h3 className="reviews-title">리뷰 목록 ({count})</h3>
          <div 
            className="photo-only-toggle" 
            onClick={() => setPhotoOnly(!photoOnly)}
            id="photo-reviews-only-toggle"
          >
            <span>사진 리뷰만 모아보기</span>
            <div className={`toggle-switch ${photoOnly ? 'active' : ''}`}>
              <div className="toggle-handle" />
            </div>
          </div>
        </div>

        {/* Review Filtering Tabs */}
        {!photoOnly && (
          <div className="reviews-filter-tabs">
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

        {/* Review Content List */}
        {photoOnly ? (
          /* Photo grid layout */
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
          /* Standard text/media cards list */
          sortedReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                    {/* Revisit indicator tag */}
                    <div className={`review-revisit-tag ${rev.revisit ? 'yes' : 'no'}`}>
                      {rev.revisit ? (
                        <>
                          <ThumbsUp size={12} fill="currentColor" />
                          <span>재방문 의사 있음</span>
                        </>
                      ) : (
                        <>
                          <ThumbsDown size={12} fill="currentColor" />
                          <span>이번만 갈래요</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= Math.round(rev.rating) ? "#FFB800" : "none"}
                        color={star <= Math.round(rev.rating) ? "#FFB800" : "var(--border-color)"}
                      />
                    ))}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginLeft: 4 }}>
                      {rev.rating}
                    </span>
                  </div>

                  {/* Body Text */}
                  <p className="review-body-text">{rev.content}</p>

                  {/* Photo attachments */}
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

                  {/* Popularity / Like counters */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Flame size={12} fill="currentColor" color="var(--primary)" />
                      <span>추천 {rev.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews-msg">작성된 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요! ✍️</div>
          )
        )}
      </div>

      {/* Floating Action Button to Write Review */}
      <button 
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 15
        }}
        onClick={onWriteReview}
        id="write-review-fab"
      >
        <PenTool size={22} />
      </button>

      {/* Lightbox / Picture Zoom Modal overlay */}
      {lightboxImage && (
        <div className="lightbox-modal" onClick={() => setLightboxImage(null)} id="image-lightbox-modal">
          <button className="lightbox-close-btn" onClick={() => setLightboxImage(null)}>
            <X size={20} />
          </button>
          <img src={lightboxImage} alt="확대 보기" className="lightbox-content" />
        </div>
      )}
    </div>
  );
};

export default DetailScreen;
