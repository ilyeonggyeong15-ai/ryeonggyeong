import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Star, MapPin, Clock, Phone, 
  ThumbsUp, ThumbsDown, X, Flame, PenTool
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DetailScreen = ({ restaurantId, onBack, onWriteReview }) => {
  const { restaurants, getRatingStats } = useApp();
  
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  const [isNaverMapLoaded, setIsNaverMapLoaded] = useState(false);

  useEffect(() => {
    // VITE_NAVER_MAP_CLIENT_ID가 환경변수나 설정에 정의되어 있는지 확인
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setIsNaverMapLoaded(false);
      return;
    }

    if (window.naver && window.naver.maps) {
      setIsNaverMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('naver-map-script');
    if (existingScript) {
      const handleLoad = () => setIsNaverMapLoaded(true);
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = 'naver-map-script';
    script.type = 'text/javascript';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsNaverMapLoaded(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Naver Map API, fallback to Leaflet');
      setIsNaverMapLoaded(false);
    };
    document.head.appendChild(script);
  }, []);

  if (!restaurant) {
    return (
      <div className="no-reviews-msg">
        가게를 찾을 수 없습니다.
        <button onClick={onBack} className="alert-btn-close">돌아가기</button>
      </div>
    );
  }

  const { rating, count } = getRatingStats(restaurant);

  // 1. Mapped images (Max 3 as requested: "최대 3개의 사진을 볼 수 있다")
  const displayImages = restaurant.images.slice(0, 3);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = displayImages.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  };

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [slideCount]);

  // Carousel Swiping Gestures (Mouse & Touch)
  const [dragStart, setDragStart] = useState(0);

  const handleTouchStart = (e) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;
    if (diff > 50) {
      // Swiped left -> next slide
      setActiveSlide((prev) => (prev + 1) % slideCount);
    } else if (diff < -50) {
      // Swiped right -> prev slide
      setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
    }
  };

  const handleMouseDown = (e) => {
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    const diff = dragStart - e.clientX;
    if (diff > 50) {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    } else if (diff < -50) {
      setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
    }
  };

  // 2. Leaflet & Naver Map Hybrid integration
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const coords = restaurant.mapCoords || { lat: 35.1458, lng: 129.0094 };

    // 1) NAVER Map API rendering
    if (isNaverMapLoaded && window.naver && window.naver.maps) {
      // Clean up leaflet instance if existed
      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === 'function') {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Naver Map
      const mapOptions = {
        center: new window.naver.maps.LatLng(coords.lat, coords.lng),
        zoom: 16,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false
      };

      const naverMap = new window.naver.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = naverMap;

      const markerContent = `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <div style="width: 14px; height: 14px; background-color: #03C75A; border: 2.5px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 8px rgba(0,0,0,0.25);"></div>
          <div style="background-color: #1c1f23; color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; margin-top: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); white-space: nowrap; font-family: 'Gowun Dodum', sans-serif;">${restaurant.name}</div>
        </div>
      `;

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(coords.lat, coords.lng),
        map: naverMap,
        icon: {
          content: markerContent,
          size: new window.naver.maps.Size(30, 42),
          anchor: new window.naver.maps.Point(15, 20)
        }
      });

      return;
    }

    // 2) Leaflet Map Fallback
    const L = window.L;
    if (!L) return;

    if (mapInstanceRef.current) {
      if (typeof mapInstanceRef.current.remove === 'function') {
        mapInstanceRef.current.remove();
      }
      mapInstanceRef.current = null;
    }

    mapInstanceRef.current = L.map(mapContainerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
          <div style="width: 14px; height: 14px; background-color: #03C75A; border: 2.5px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 8px rgba(0,0,0,0.25);"></div>
          <div style="background-color: #1c1f23; color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; margin-top: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); white-space: nowrap; font-family: 'Gowun Dodum', sans-serif;">${restaurant.name}</div>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 20]
    });

    L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === 'function') {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [restaurant, isNaverMapLoaded]);

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      if (isNaverMapLoaded && window.naver && window.naver.maps) {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
      } else if (typeof mapInstanceRef.current.zoomIn === 'function') {
        mapInstanceRef.current.zoomIn();
      }
    }
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      if (isNaverMapLoaded && window.naver && window.naver.maps) {
        mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
      } else if (typeof mapInstanceRef.current.zoomOut === 'function') {
        mapInstanceRef.current.zoomOut();
      }
    }
  };

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

        {/* Photo Carousel (Touch-swipeable & drag-slideable, showing max 3 pictures) */}
        <div 
          className="carousel-container" 
          style={{ borderRadius: 0, height: 200, cursor: 'grab', position: 'relative', overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div 
            style={{ 
              display: 'flex', 
              width: `${slideCount * 100}%`, 
              height: '100%', 
              transform: `translateX(-${(activeSlide / slideCount) * 100}%)`, 
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}
          >
            {displayImages.map((imgUrl, index) => (
              <div key={index} style={{ width: `${100 / slideCount}%`, height: '100%', flexShrink: 0 }}>
                <img
                  src={imgUrl}
                  alt={`${restaurant.name} 사진 ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                  }}
                />
              </div>
            ))}
          </div>
          {slideCount > 1 && (
            <div className="carousel-indicators">
              {displayImages.map((_, index) => (
                <div
                  key={index}
                  className={`indicator-dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setActiveSlide(index); }}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title & Rating */}
        <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="detail-title" style={{ fontSize: 17 }}>{restaurant.name}</h2>
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
              <div className="info-item-value">{restaurant.hours || '영업시간 정보 없음'}</div>
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

        {/* Interactive Leaflet Map styled as Naver Map */}
        <div style={{ margin: '0 16px 14px', position: 'relative' }}>
          <div
            ref={mapContainerRef}
            id="naver-map-simulator"
            style={{
              height: '150px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              position: 'relative',
              backgroundColor: '#E4ECE5',
              zIndex: 1
            }}
          />
          {/* Naver style logo watermark overlay */}
          <div 
            className="naver-logo-watermark" 
            style={{ 
              position: 'absolute', 
              bottom: '8px', 
              left: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.92)', 
              padding: '3px 7px', 
              borderRadius: '4px', 
              fontSize: '9px', 
              fontWeight: 800, 
              color: '#03C75A', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <div className="naver-logo-circle" style={{ width: '6px', height: '6px', backgroundColor: '#03C75A', borderRadius: '50%' }} />
            <span>NAVER 지도</span>
          </div>
          {/* Zoom controls */}
          <div 
            className="map-control-zoom" 
            style={{ 
              position: 'absolute', 
              right: '8px', 
              bottom: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1px', 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)', 
              zIndex: 10 
            }}
          >
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
