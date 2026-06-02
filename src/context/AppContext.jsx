import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Current user details
  const [user, setUser] = useState({
    name: '김냠냠',
    avatar: '냠',
    university: '냠냠대학교',
    department: '인공지능학과 23학번',
    favoriteCategory: '분식'
  });

  // Main Restaurants Database with coordinates, images, and reviews
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: '대박분식',
      category: '분식',
      distance: 120, // meters
      avgPrice: 6500,
      priceLevel: '5,000원 ~ 8,000원',
      hours: '10:00 ~ 21:00 (매주 일요일 휴무)',
      address: '서울특별시 마포구 백범로 35 1층',
      phone: '02-711-2345',
      description: '과잠 입고 혼밥하기 딱 좋은 학교 앞 최고의 혜자 분식집! 매콤달콤한 쌀떡볶이와 수제 튀김이 인기입니다.',
      images: [
        '/food_bunshik.png',
        '/logo.png',
        '/food_japanese.png'
      ],
      mapCoords: { x: 0.05, y: -0.02 }, // Simulated map coordinate offsets
      reviews: [
        {
          id: 101,
          author: '홍길동',
          avatar: '홍',
          rating: 5,
          content: '여기 떡볶이는 주기적으로 수혈해줘야 합니다! 양도 진짜 많고 튀김옷이 완전 바삭해요. 돈 없는 대학생에게 최고의 안식처입니다.',
          images: ['/food_bunshik.png'],
          revisit: true,
          date: '2026-06-01',
          likes: 24
        },
        {
          id: 102,
          author: '김냠냠',
          avatar: '냠',
          rating: 4.8,
          content: '혼밥하기 아주 쾌적해요! 떡튀순 세트 하나 시키면 남자 둘이 먹어도 될 정도로 양이 넘쳐납니다. 동글동글 꼬마김밥도 꼭 드셔보세요.',
          images: ['/logo.png'],
          revisit: true,
          date: '2026-05-28',
          likes: 12
        }
      ]
    },
    {
      id: 2,
      name: '청년라멘',
      category: '일식',
      distance: 210,
      avgPrice: 9500,
      priceLevel: '9,000원 ~ 12,000원',
      hours: '11:00 ~ 20:30 (Break 15:00 ~ 17:00)',
      address: '서울특별시 마포구 대흥로 12 골목길 안쪽',
      phone: '02-789-9988',
      description: '가마솥에서 24시간 동안 직접 우려낸 진하고 깊은 돈코츠 육수가 예술입니다. 밥 추가가 무료입니다!',
      images: [
        '/food_japanese.png',
        '/food_pasta.png',
        '/food_bunshik.png'
      ],
      mapCoords: { x: -0.08, y: 0.04 },
      reviews: [
        {
          id: 201,
          author: '일식빌런',
          avatar: '일',
          rating: 4.5,
          content: '국물이 진짜 찐해요! 한국식 라멘이랑 차원이 다릅니다. 면 삶기 조절도 가능해서 좋아요. 점심엔 웨이팅이 조금 있으니 주의하세요.',
          images: [],
          revisit: true,
          date: '2026-05-30',
          likes: 15
        }
      ]
    },
    {
      id: 3,
      name: '진성반점',
      category: '중식',
      distance: 350,
      avgPrice: 7500,
      priceLevel: '7,000원 ~ 10,000원',
      hours: '10:30 ~ 20:30 (연중무휴)',
      address: '서울특별시 마포구 서강로 89 2층',
      phone: '02-715-4422',
      description: '부먹 찍먹 고민 없는 즉석 미니 탕수육 세트가 유명한 중식당. 짜장면 면발이 쫄깃하고 해장용 짬뽕 국물이 일품입니다.',
      images: [
        '/food_bunshik.png',
        '/food_japanese.png'
      ],
      mapCoords: { x: 0.12, y: 0.09 },
      reviews: [
        {
          id: 301,
          author: '공대해장러',
          avatar: '공',
          rating: 4.0,
          content: '동아리 술자리 다음날 무조건 찾는 짬뽕 맛집입니다. 칼칼하고 시원해서 속이 확 풀려요. 가성비 최고의 중국집.',
          images: [],
          revisit: true,
          date: '2026-05-25',
          likes: 8
        }
      ]
    },
    {
      id: 4,
      name: '마마스 키친',
      category: '양식',
      distance: 450,
      avgPrice: 13000,
      priceLevel: '11,000원 ~ 15,000원',
      hours: '11:30 ~ 21:30 (Break 15:30 ~ 17:00)',
      address: '서울특별시 마포구 독막로 210 정원 빌딩',
      phone: '02-321-4567',
      description: '아늑하고 앤티크한 분위기에서 즐기는 수제 파스타와 리조또 맛집. 커플 데이트 장소나 특별한 날 방문하기 좋아요.',
      images: [
        '/food_pasta.png',
        '/food_bunshik.png',
        '/food_japanese.png'
      ],
      mapCoords: { x: -0.03, y: -0.12 },
      reviews: [
        {
          id: 401,
          author: '러블리커플',
          avatar: '러',
          rating: 5,
          content: '크림 파스타가 정말 꾸덕하고 소스가 넉넉해요. 분위기 좋은 데 맛도 좋고 가성비가 훌륭해서 자주 가요. 단골 예약!',
          images: ['/food_pasta.png'],
          revisit: true,
          date: '2026-05-29',
          likes: 18
        }
      ]
    },
    {
      id: 5,
      name: '돈까스 스쿨',
      category: '일식',
      distance: 80,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 11,000원',
      hours: '11:00 ~ 20:00 (토요일 휴무)',
      address: '서울특별시 마포구 신촌로 14 냠냠대 학생회관 지하 1층',
      phone: '02-701-4321',
      description: '겉은 바삭하고 속은 촉촉한 일본식 수제 안심돈까스 전문점. 국내산 한돈만 사용하여 신선하고 육즙이 넘쳐납니다.',
      images: [
        '/food_japanese.png',
        '/food_pasta.png'
      ],
      mapCoords: { x: 0.01, y: 0.02 },
      reviews: [
        {
          id: 501,
          author: '학식질려',
          avatar: '학',
          rating: 4.9,
          content: '학생회관 안에 있어서 수업 끝나고 가기 너무 편해요! 고기 질이 정말 부드럽고 튀김옷이 얇고 바삭해서 대만족입니다.',
          images: ['/food_japanese.png'],
          revisit: true,
          date: '2026-06-02',
          likes: 29
        }
      ]
    }
  ]);

  // Global Actions
  const addReview = (restaurantId, reviewData) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const newReview = {
            id: Date.now(),
            author: user.name,
            avatar: user.avatar,
            rating: parseFloat(reviewData.rating) || 5.0,
            content: reviewData.content,
            images: reviewData.images || [],
            revisit: reviewData.revisit,
            date: new Date().toISOString().split('T')[0],
            likes: 0
          };
          return {
            ...r,
            reviews: [newReview, ...r.reviews] // Add to start (latest)
          };
        }
        return r;
      })
    );
  };

  const deleteReview = (restaurantId, reviewId) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            reviews: r.reviews.filter((rev) => rev.id !== reviewId)
          };
        }
        return r;
      })
    );
  };

  // Helper selectors
  const getRatingStats = (restaurant) => {
    if (!restaurant.reviews.length) return { rating: 0, count: 0 };
    const sum = restaurant.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const avg = (sum / restaurant.reviews.length).toFixed(1);
    return {
      rating: parseFloat(avg),
      count: restaurant.reviews.length
    };
  };

  // Get user-written reviews across all restaurants
  const getUserReviews = () => {
    const userReviews = [];
    restaurants.forEach((restaurant) => {
      restaurant.reviews.forEach((review) => {
        if (review.author === user.name) {
          userReviews.push({
            ...review,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantCategory: restaurant.category
          });
        }
      });
    });
    return userReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        restaurants,
        addReview,
        deleteReview,
        getRatingStats,
        getUserReviews
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
