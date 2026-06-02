import React, { useState } from 'react';
import { Search, Star, MapPin, Clock, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MainScreen = ({ onSelectRestaurant }) => {
  const { restaurants, getRatingStats } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'reviews', 'price'

  const categories = ['전체', '한식', '일식', '중식', '분식', '양식', '야식'];

  // 1. Filter by Search Query & Selected Category
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === '전체' ||
      restaurant.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 2. Sort by Selected Filter
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    const statsA = getRatingStats(a);
    const statsB = getRatingStats(b);

    if (sortBy === 'distance') {
      return a.distance - b.distance; // closest first
    } else if (sortBy === 'reviews') {
      return statsB.count - statsA.count; // most reviews first
    } else if (sortBy === 'price') {
      return a.avgPrice - b.avgPrice; // cheapest first
    }
    return 0;
  });

  return (
    <div className="fade-in">
      {/* Header section with brand logo */}
      <div className="home-header">
        <div className="brand-wrapper">
          <div className="logo-icon">냠</div>
          <span className="brand-name">냠냠스쿨</span>
        </div>

        {/* Search Input Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon-left" />
          <input
            type="text"
            className="search-input"
            placeholder="음식점 이름이나 카테고리를 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="restaurant-search-input"
          />
        </div>
      </div>

      {/* Category Horizontal Slider */}
      <div className="categories-slider">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${
              (selectedCategory === cat || (cat === '전체' && !selectedCategory)) ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(cat === '전체' ? '' : cat)}
            id={`category-${cat}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting bar */}
      <div className="filters-bar">
        <span className="restaurant-count">밥집 {sortedRestaurants.length}개</span>
        <div className="filter-options">
          <button
            className={`filter-btn ${sortBy === 'distance' ? 'active' : ''}`}
            onClick={() => setSortBy('distance')}
            id="filter-distance"
          >
            거리순
          </button>
          <button
            className={`filter-btn ${sortBy === 'reviews' ? 'active' : ''}`}
            onClick={() => setSortBy('reviews')}
            id="filter-reviews"
          >
            리뷰순
          </button>
          <button
            className={`filter-btn ${sortBy === 'price' ? 'active' : ''}`}
            onClick={() => setSortBy('price')}
            id="filter-price"
          >
            가격순
          </button>
        </div>
      </div>

      {/* Restaurant Vertical Scroll List */}
      <div className="restaurant-list">
        {sortedRestaurants.length > 0 ? (
          sortedRestaurants.map((restaurant) => {
            const { rating, count } = getRatingStats(restaurant);
            return (
              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => onSelectRestaurant(restaurant.id)}
                id={`restaurant-card-${restaurant.id}`}
              >
                {/* Image wrapper */}
                <div className="card-img-wrapper">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=350";
                    }}
                  />
                  <span className="card-tag">{restaurant.category}</span>
                  <span className="card-distance">{restaurant.distance}m</span>
                </div>

                {/* Details info */}
                <div className="card-info">
                  <div className="card-header-row">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <div className="rating-badge">
                      <Star size={14} fill="#FFB800" color="#FFB800" />
                      <span>{rating > 0 ? rating : '평가없음'}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                        ({count})
                      </span>
                    </div>
                  </div>
                  <p className="card-desc">{restaurant.description}</p>
                  <div className="card-footer-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      <span>{restaurant.hours.split('(')[0]}</span>
                    </div>
                    <span>{restaurant.priceLevel}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-reviews-msg">검색 결과에 맞는 밥집이 없습니다. 😢</div>
        )}
      </div>
    </div>
  );
};

export default MainScreen;
