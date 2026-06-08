import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('yumyum_user');
    return saved ? JSON.parse(saved) : {
      name: '김냠냠',
      nickname: '김냠냠',
      avatar: '냠',
      university: '동서대학교',
      grade: '1학년',
      department: '인공지능학과 23학번',
      favoriteCategory: '분식'
    };
  });

  // Main Restaurants Database matching the 30 campus places
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('yumyum_restaurants');
    let targetData = null;
    if (saved) {
      try {
        targetData = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved restaurants:', e);
      }
    }

    const isIrrelevantReview = (content) => {
      // 1. 동일 문자 5회 이상 도배 (예: 아아아아아, ㅋㅋㅋㅋㅋ, ㅎㅎㅎㅎㅎ)
      if (/([ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9])\1{4,}/g.test(content)) return true;
      // 2. 자음이나 모음의 비율이 50% 이상인 경우 (무의미한 텍스트)
      const hangulJamo = content.match(/[ㄱ-ㅎㅏ-ㅣ]/g) || [];
      if (hangulJamo.length > content.length * 0.5) return true;
      return false;
    };

    const cleanReviews = (list) => {
      return list.map(r => ({
        ...r,
        reviews: r.reviews.filter(rev => !isIrrelevantReview(rev.content))
      }));
    };

    if (targetData) {
      return cleanReviews(targetData);
    }

    return cleanReviews([
    {
      id: 1,
      name: '한솥도시락 동서대 2호점',
      category: '한식',
      distance: 50,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 7,500원',
      hours: '10:00 ~ 18:00',
      address: '부산 사상구 주례로 82',
      phone: '051-322-1144',
      description: '가성비 최강 도시락 브랜드! 따뜻한 치킨마요와 정갈한 도련님 도시락은 영원한 대학생의 든든한 동반자입니다.',
      images: ['/images/한솥도시락 동서대 2호점.jpeg', '/images/한솥도시락 2.jpeg', '/images/한솥도시락 3.jpeg'],
      mapCoords: { lat: 35.1481, lng: 129.0076 },
      reviews: [
        { id: 101, author: '동서이즈', avatar: '동', rating: 4.8, content: '치킨마요 빅사이즈로 시키면 점심 내내 든든합니다. 가성비 최고!', images: [], revisit: true, date: '2026-06-01', likes: 12 }
      ]
    },
    {
      id: 2,
      name: '송산',
      category: '한식',
      distance: 70,
      avgPrice: 8500,
      priceLevel: '7,000원 ~ 11,000원',
      hours: '11:30 ~ 21:00',
      address: '부산 사상구 주례로 80 주례우진아파트',
      phone: '051-325-8855',
      description: '우진아파트 삼거리 부근 집밥 정식 맛집. 매일 바뀌는 밑반찬과 칼칼한 김치찌개가 자취생 입맛을 사로잡습니다.',
      images: ['/images/송산식당.jpeg', '/images/송산식당 2.jpeg'],
      mapCoords: { lat: 35.1479, lng: 129.0078 },
      reviews: [
        { id: 201, author: '찌개요정', avatar: '찌', rating: 4.2, content: '김치찌개가 칼칼하고 반찬이 매일 바뀌어서 집밥 생각날 때마다 가요.', images: [], revisit: true, date: '2026-05-30', likes: 6 }
      ]
    },
    {
      id: 3,
      name: '또바기 김밥',
      category: '분식',
      distance: 250,
      avgPrice: 5000,
      priceLevel: '3,500원 ~ 7,000원',
      hours: '08:00 ~ 20:00 (라스트오더 19:20)',
      address: '부산 사상구 가야대로318번길 88 1층',
      phone: '051-312-3210',
      description: '속이 꽉 찬 뚱뚱이 김밥과 매콤달콤 떡볶이가 일품인 가야대로 골목 대표 분식점.',
      images: ['/images/또바기김밥.jpeg', '/images/또바기김밥 2.jpeg'],
      mapCoords: { lat: 35.1492, lng: 129.0112 },
      reviews: [
        { id: 301, author: '김밥러버', avatar: '김', rating: 5, content: '참치김밥 고소하고 떡볶이 국물에 찍어 먹으면 눈물 나게 맛있어요!', images: ['/images/또바기김밥.jpeg'], revisit: true, date: '2026-06-02', likes: 18 }
      ]
    },
    {
      id: 4,
      name: '닭다구리',
      category: '야식',
      distance: 270,
      avgPrice: 9500,
      priceLevel: '8,000원 ~ 15,000원',
      hours: '16:00 ~ 24:00',
      address: '부산 사상구 가야대로318번길 85',
      phone: '051-323-5599',
      description: '매콤달콤 닭갈비와 바삭한 닭똥집 튀김이 일품인 시험기간 대학생 야식 필수 코스.',
      images: ['/images/닭다구리.jpeg', '/images/닭다구리 2.jpeg'],
      mapCoords: { lat: 35.1491, lng: 129.0110 },
      reviews: [
        { id: 401, author: '닭사냥꾼', avatar: '닭', rating: 4.5, content: '시험 기간에 야식으로 시켜 먹기 딱 좋음. 양도 넉넉하고 닭고기가 부드러워요.', images: [], revisit: true, date: '2026-05-29', likes: 4 }
      ]
    },
    {
      id: 5,
      name: '화반',
      category: '한식',
      distance: 110,
      avgPrice: 8500,
      priceLevel: '7,500원 ~ 10,000원',
      hours: '10:30 ~ 20:30 (Break 15:00~16:00, 라스트오더 20:00)',
      address: '부산 사상구 주례로 76-1 1층',
      phone: '051-315-7610',
      description: '고기와 야채가 푸짐하게 나오는 대학가 정갈한 비빔밥 전문점. 깔끔한 1인 트레이 서빙으로 인기.',
      images: ['/images/화반.jpg'],
      mapCoords: { lat: 35.1475, lng: 129.0083 },
      reviews: [
        { id: 501, author: '깔끔러', avatar: '깔', rating: 4.9, content: '비빔밥 고기 양도 많고 계란프라이도 맛있음!! 매장도 조용하고 위생적임.', images: [], revisit: true, date: '2026-06-02', likes: 15 }
      ]
    },
    {
      id: 6,
      name: '골라먹는 재미',
      category: '분식',
      distance: 100,
      avgPrice: 6000,
      priceLevel: '5,000원 ~ 8,000원',
      hours: '10:30 ~ 20:00',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-321-4477',
      description: '다양한 분식과 스낵을 한 번에 골라 즐길 수 있는 재미있는 뷔페형 분식 카페.',
      images: ['/images/골라먹는재미.jpeg', '/images/골라먹는재미 2.jpeg'],
      mapCoords: { lat: 35.1476, lng: 129.0081 },
      reviews: [
        { id: 601, author: '배고픈돼지', avatar: '배', rating: 4.0, content: '메뉴 고민될 때 그냥 여기 가면 다 해결됩니다. 양껏 먹을 수 있어 굳.', images: [], revisit: true, date: '2026-05-24', likes: 2 }
      ]
    },
    {
      id: 7,
      name: 'AVENDUTCH (아벤더치)',
      category: '카페',
      distance: 95,
      avgPrice: 3500,
      priceLevel: '2,000원 ~ 5,500원',
      hours: '08:00 ~ 19:30',
      address: '부산 사상구 주례로 77 3동 3호',
      phone: '051-325-1177',
      description: '저렴하고 컵 크기가 무지막지하게 큰 가성비 테이크아웃 커피 전문점. 등교길 카페인 충전 완료.',
      images: ['/images/AVENDUTCH.jpeg', '/images/AVENDUTCH 2.jpeg'],
      mapCoords: { lat: 35.1476, lng: 129.0081 },
      reviews: [
        { id: 701, author: '아아수혈기', avatar: '아', rating: 4.7, content: '여기 아아는 진짜 용량이 깡패입니다. 가격도 싸서 매일 들러요.', images: [], revisit: true, date: '2026-06-03', likes: 9 }
      ]
    },
    {
      id: 8,
      name: '량야각',
      category: '중식',
      distance: 115,
      avgPrice: 8000,
      priceLevel: '7,000원 ~ 12,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주례로 76-1',
      phone: '051-316-7611',
      description: '정통 중화요리 전문점. 겉바속촉 탕수육과 불맛 가득 짜장면이 예술입니다.',
      images: ['/images/량야각.jpg', '/images/량야각2.jpg', '/images/량야각3.jpg', '/images/량야각4.jpg'],
      mapCoords: { lat: 35.1475, lng: 129.0083 },
      reviews: [
        { id: 801, author: '짜장귀신', avatar: '짜', rating: 4.8, content: '탕수육이랑 쟁반짜장 세트가 가성비 대박입니다. 소스가 엄청 진해요.', images: ['/images/량야각.jpg'], revisit: true, date: '2026-06-01', likes: 21 }
      ]
    },
    {
      id: 9,
      name: 'BARATO (바라토)',
      category: '양식',
      distance: 85,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 13,000원',
      hours: '10:30 ~ 19:30',
      address: '부산 사상구 주례로 79 우진아파트 상가',
      phone: '051-326-7900',
      description: '부담 없는 가격(Barato)에 맛있는 스파게티와 베이컨 필라프를 즐길 수 있는 양식 브랜드.',
      images: ['/images/BARATO.jpeg', '/images/BARATO 2.jpeg'],
      mapCoords: { lat: 35.1478, lng: 129.0080 },
      reviews: [
        { id: 901, author: '파스타매니아', avatar: '파', rating: 4.6, content: '토마토 오븐 파스타랑 베이컨 필라프 가성비 짱입니다. 무난하고 맛있어요.', images: [], revisit: true, date: '2026-05-28', likes: 7 }
      ]
    },
    {
      id: 10,
      name: '용빈각',
      category: '중식',
      distance: 100,
      avgPrice: 7000,
      priceLevel: '6,500원 ~ 10,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-314-2090',
      description: '총알 배달과 푸짐한 양으로 유명한 주례동 동네 터줏대감 중국집.',
      images: ['/images/용빈각.jpeg', '/images/용빈각 2.jpeg'],
      mapCoords: { lat: 35.1476, lng: 129.0081 },
      reviews: [
        { id: 1001, author: '신속배달', avatar: '신', rating: 4.2, content: '간짜장 시켰는데 면이 안 불고 엄청 빨리 옴. 소스 건더기가 푸짐해요.', images: [], revisit: true, date: '2026-05-27', likes: 3 }
      ]
    },
    {
      id: 11,
      name: '아레밀 (카페)',
      category: '카페',
      distance: 100,
      avgPrice: 4500,
      priceLevel: '3,500원 ~ 6,500원',
      hours: '11:00 ~ 22:00 (여름방학 + 겨울방학 휴무)',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-325-7788',
      description: '학기 중에만 운영하는 아늑한 카페. 두툼한 수제 와플과 달콤한 차가 시그니처입니다.',
      images: ['/images/아레밀.jpeg', '/images/아레밀 2.jpeg', '/images/아레밀 3.jpeg'],
      mapCoords: { lat: 35.1476, lng: 129.0081 },
      reviews: [
        { id: 1101, author: '와플매니아', avatar: '와', rating: 4.9, content: '여기 와플 진짜 생크림 듬뿍 올라가고 맛있어요 방학에 쉬는게 아쉽습니다.', images: [], revisit: true, date: '2026-05-29', likes: 14 }
      ]
    },
    {
      id: 12,
      name: '경대 컵밥',
      category: '분식',
      distance: 120,
      avgPrice: 5000,
      priceLevel: '4,000원 ~ 6,500원',
      hours: '08:30 ~ 20:30',
      address: '부산 사상구 주례로 76',
      phone: '051-313-7600',
      description: '짧은 쉬는시간 10분 만에 뚝딱 해치울 수 있는 간편하고 든든한 컵밥 전문점.',
      images: ['/images/경대컵밥.jpeg', '/images/경대컵밥 2.jpeg'],
      mapCoords: { lat: 35.1474, lng: 129.0084 },
      reviews: [
        { id: 1201, author: '바쁜학부생', avatar: '바', rating: 4.8, content: '모둠컵밥 하나 포장해서 우주공강 때 먹으면 꿀맛입니다. 소스가 대박.', images: [], revisit: true, date: '2026-06-02', likes: 8 }
      ]
    },
    {
      id: 13,
      name: '꽃돼지국밥',
      category: '한식',
      distance: 140,
      avgPrice: 8500,
      priceLevel: '8,000원 ~ 9,500원',
      hours: '10:00 ~ 21:00 (라스트오더 20:30)',
      address: '부산 사상구 주례로 74 1층',
      phone: '051-322-7474',
      description: '잡내 없이 깔끔하게 우려낸 맑고 뽀얀 돼지국밥 국물과 넘치도록 담아주는 고기의 조화.',
      images: ['/images/꽃돼지국밥.jpeg', '/images/꽃돼지국밥 2.jpeg'],
      mapCoords: { lat: 35.1472, lng: 129.0086 },
      reviews: [
        { id: 1301, author: '해장귀신', avatar: '해', rating: 5, content: '부산 국밥집 탑티어 중 하나입니다. 국물이 진짜 맑고 고기 잡내가 하나도 안 나요.', images: [], revisit: true, date: '2026-05-31', likes: 25 }
      ]
    },
    {
      id: 14,
      name: '찬팅',
      category: '중식',
      distance: 140,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 15,000원',
      hours: '10:00 ~ 21:00',
      address: '부산 사상구 주례로 74 2층',
      phone: '051-314-7400',
      description: '중독성 강한 얼싸한 맛! 대학생들에게 사랑받는 셀프 마라탕 및 마라샹궈 맛집.',
      images: ['/images/찬팅.jpeg'],
      mapCoords: { lat: 35.1472, lng: 129.0086 },
      reviews: [
        { id: 1401, author: '마라중독', avatar: '마', rating: 4.6, content: '꿔바로우 소스가 엄청 달콤새콤하고 마라탕 국물도 땅콩맛 찐하게 나서 맛있어요.', images: [], revisit: true, date: '2026-05-30', likes: 11 }
      ]
    },
    {
      id: 15,
      name: '꼬망',
      category: '분식',
      distance: 100,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 8,000원',
      hours: '10:30 ~ 20:00',
      address: '부산 사상구 주례로 77 우진아파트상가 9호',
      phone: '051-325-7709',
      description: '참치김밥과 라면 세트가 맛있는 친절하고 정겨운 동네 학창시절 감성 분식집.',
      images: ['/images/꼬망.jpeg', '/images/꼬망 2.jpeg', '/images/꼬망 3.jpeg'],
      mapCoords: { lat: 35.1476, lng: 129.0081 },
      reviews: [
        { id: 1501, author: '라면도둑', avatar: '라', rating: 4.3, content: '라면 국물에 참밥 말아 먹으면 최고예요. 아기자기하고 친절합니다.', images: [], revisit: true, date: '2026-05-22', likes: 1 }
      ]
    },
    {
      id: 16,
      name: '엄마밥상',
      category: '한식',
      distance: 160,
      avgPrice: 7500,
      priceLevel: '7,000원 ~ 9,000원',
      hours: '10:00 ~ 20:00',
      address: '부산 사상구 주례로 72-1',
      phone: '051-323-7201',
      description: '어머니의 정성이 느껴지는 집밥 전문 백반집. 매일 찬이 새롭게 바뀌는 불백 정식이 베스트.',
      images: ['/images/엄마밥상.jpeg', '/images/엄마밥상 2.jpeg'],
      mapCoords: { lat: 35.1470, lng: 129.0088 },
      reviews: [
        { id: 1601, author: '자취생B', avatar: '자', rating: 5, content: '반찬 가짓수가 장난 아니고 밥 리필 무한입니다. 자취생들에게 생명수 같은 밥집.', images: [], revisit: true, date: '2026-06-02', likes: 19 }
      ]
    },
    {
      id: 17,
      name: 'CAFF.RAN (카페란)',
      category: '카페',
      distance: 170,
      avgPrice: 4000,
      priceLevel: '3,000원 ~ 5,500원',
      hours: '09:30 ~ 22:00',
      address: '부산 사상구 주례로 72 카페란',
      phone: '051-315-7200',
      description: '카공족 강추! 조용하고 아늑하며 충전 콘센트가 잘 구비된 대학가 스터디 분위기 카페.',
      images: ['/images/CAFE.RAN.jpeg', '/images/CAFE.RAN 2.jpeg', '/images/CAFE.RAN 3.jpeg'],
      mapCoords: { lat: 35.1469, lng: 129.0089 },
      reviews: [
        { id: 1701, author: '시험기간카공', avatar: '시', rating: 4.8, content: '콘센트 자리가 많고 조용해서 집중하기 최적화된 곳입니다. 말차라떼 맛있어요.', images: [], revisit: true, date: '2026-05-28', likes: 13 }
      ]
    },
    {
      id: 18,
      name: '평창메밀막국수',
      category: '한식',
      distance: 200,
      avgPrice: 8500,
      priceLevel: '8,000원 ~ 10,000원',
      hours: '11:00 ~ 20:00',
      address: '부산 사상구 주례로 68-1',
      phone: '051-328-6810',
      description: '시원하고 고소한 평창식 정통 메밀 막국수와 쫄깃한 메밀꿩만두가 인기 있는 여름철 핫플레이스.',
      images: ['/images/평창메밀막국수.jpeg', '/images/평창메밀막국수 2.jpeg'],
      mapCoords: { lat: 35.1466, lng: 129.0092 },
      reviews: [
        { id: 1901, author: '여름조아', avatar: '여', rating: 4.7, content: '살얼음 동동 띄워진 육수가 환상적입니다. 감자만두 같이 시켜서 드세요.', images: [], revisit: true, date: '2026-06-03', likes: 10 }
      ]
    },
    {
      id: 19,
      name: '동경식사타임',
      category: '일식',
      distance: 210,
      avgPrice: 9500,
      priceLevel: '8,500원 ~ 12,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주례로 68',
      phone: '051-316-6800',
      description: '두툼한 돈카츠 덮밥인 가츠동과 단짠 규동 소스가 훌륭한 정통 일본식 덮밥 전문점.',
      images: ['/images/동경 식사타임.jpeg'],
      mapCoords: { lat: 35.1465, lng: 129.0093 },
      reviews: [
        { id: 2001, author: '돈부리파', avatar: '돈', rating: 4.6, content: '더블 가츠동 시켰는데 돈까스 크기가 대박이네요. 겉은 바삭하고 속은 부드러워요.', images: [], revisit: true, date: '2026-05-30', likes: 8 }
      ]
    },
    {
      id: 20,
      name: '냉정커피 (카페)',
      category: '카페',
      distance: 440,
      avgPrice: 3800,
      priceLevel: '2,500원 ~ 5,000원',
      hours: '09:00 ~ 18:00',
      address: '부산 사상구 주례로 45 KIT학생생활관 1관 1층',
      phone: '051-320-1111',
      description: '동서대학교 학생관 내에 입점해 있어 착한 가격으로 모닝 아메리카노를 마실 수 있는 쉼터.',
      images: ['/images/냉정커피.jpeg', '/images/냉정커피 2.jpeg'],
      mapCoords: { lat: 35.1442, lng: 129.0116 },
      reviews: [
        { id: 2101, author: '기숙사생', avatar: '기', rating: 4.9, content: '기숙사 바로 아래라 슬리퍼 끌고 테이크아웃 해오기 너무 개꿀입니다. 가성비 대만족.', images: [], revisit: true, date: '2026-06-03', likes: 16 }
      ]
    },
    {
      id: 21,
      name: '맛풍',
      category: '한식',
      distance: 440,
      avgPrice: 8000,
      priceLevel: '7,000원 ~ 10,000원',
      hours: '10:30 ~ 20:30',
      address: '부산 사상구 주례로 45',
      phone: '051-320-2222',
      description: '뜨끈뜨끈한 뚝배기 제육덮밥과 자글자글 끓여낸 된장찌개가 매력적인 든든한 밥집.',
      images: ['/images/맛풍.jpeg'],
      mapCoords: { lat: 35.1442, lng: 129.0116 },
      reviews: [
        { id: 2201, author: '프로혼밥러', avatar: '프', rating: 4.5, content: '제육이 완전 불맛나고 매콤해요. 대학가 한식당 중 손꼽히는 맛입니다.', images: [], revisit: true, date: '2026-05-29', likes: 5 }
      ]
    },
    {
      id: 22,
      name: '투가이즈',
      category: '양식',
      distance: 250,
      avgPrice: 12000,
      priceLevel: '10,000원 ~ 20,000원',
      hours: '11:30 ~ 21:00 (Break 15:00~17:00, 라스트오더 20:30)',
      address: '부산 사상구 주례로 64',
      phone: '051-315-6464',
      description: '피자 & 치킨 & 오븐 스파게티 콤보 세트로 유명해 단체 배달 및 과 모임 뒤풀이에 딱인 양식당.',
      images: ['/images/투가이즈.jpeg', '/images/투가이즈 2.jpeg'],
      mapCoords: { lat: 35.1462, lng: 129.0096 },
      reviews: [
        { id: 2301, author: '피치스', avatar: '피', rating: 4.8, content: '피자 도우가 완전 고소하고 순살 치킨도 바삭해요. 가격 대비 양이 어마무시합니다.', images: ['/images/투가이즈.jpeg'], revisit: true, date: '2026-06-02', likes: 12 }
      ]
    },
    {
      id: 23,
      name: '황금룡',
      category: '중식',
      distance: 270,
      avgPrice: 7500,
      priceLevel: '6,500원 ~ 11,000원',
      hours: '11:00 ~ 20:00',
      address: '부산 사상구 주례로 62',
      phone: '051-321-6262',
      description: '푸짐하게 얹어주는 홍합과 오징어 건더기가 들어있는 얼큰하고 칼칼한 해물 짬뽕 전문점.',
      images: ['/images/황금룡.jpg', '/images/황금룡2.jpg'],
      mapCoords: { lat: 35.1460, lng: 129.0098 },
      reviews: [
        { id: 2401, author: '해물사랑', avatar: '해', rating: 4.3, content: '짜장면 소스가 진하고 면발이 부드럽습니다. 짬뽕엔 오징어랑 조개가 가득해요.', images: [], revisit: true, date: '2026-05-24', likes: 3 }
      ]
    },
    {
      id: 24,
      name: '이삭토스트',
      category: '분식',
      distance: 280,
      avgPrice: 4200,
      priceLevel: '3,000원 ~ 6,000원',
      hours: '11:00 ~ 18:00 (라스트오더 17:50)',
      address: '부산 사상구 주례로 60-1',
      phone: '051-326-6010',
      description: '달콤한 특제 마법 키위 소스와 콘 옥수수 계란 패티가 어우러진 국가대표 토스트 전문 브랜드.',
      images: ['/images/이삭토스트.jpeg', '/images/이삭토스트 2.jpeg'],
      mapCoords: { lat: 35.1459, lng: 129.0099 },
      reviews: [
        { id: 2501, author: '이삭중독', avatar: '이', rating: 5, content: '햄스페셜 토스트에 아메리카노 마시면 점심 간단하게 해결 완료. 키위소스 사랑해요.', images: [], revisit: true, date: '2026-06-03', likes: 8 }
      ]
    },
    {
      id: 25,
      name: '봉숭아학당',
      category: '분식',
      distance: 290,
      avgPrice: 6500,
      priceLevel: '5,000원 ~ 9,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주레로 60',
      phone: '051-316-6000',
      description: '추억의 옛 학교 교실 컨셉이 매력적인 복고 감성의 떡라면, 주먹밥 전문 분식집.',
      images: ['/images/봉숭아학당.jpeg', '/images/봉숭아학당 2.jpeg'],
      mapCoords: { lat: 35.1458, lng: 129.0100 },
      reviews: [
        { id: 2601, author: '추억소환', avatar: '추', rating: 4.6, content: '주먹밥이 대접만 한 크기로 나와요. 라면 국물에 풀어먹으면 대박.', images: [], revisit: true, date: '2026-05-21', likes: 4 }
      ]
    },
    {
      id: 26,
      name: '봉구스 밥버거',
      category: '분식',
      distance: 290,
      avgPrice: 4000,
      priceLevel: '3,000원 ~ 5,500원',
      hours: '09:30 ~ 20:00',
      address: '부산 사상구 주례로 60',
      phone: '051-325-6000',
      description: '단돈 몇 천 원으로 즐기는 고소한 김치참치마요 밥버거. 숟가락으로 떠먹는 재미까지.',
      images: ['/images/봉구스밥버거.jpeg', '/images/봉구스 밥버거 2.jpeg'],
      mapCoords: { lat: 35.1458, lng: 129.0100 },
      reviews: [
        { id: 2701, author: '봉구스맨', avatar: '봉', rating: 4.8, content: '치즈봉구세에 햄 추가하면 지상낙원입니다. 대학생 필수 코스.', images: [], revisit: true, date: '2026-05-28', likes: 7 }
      ]
    },
    {
      id: 27,
      name: '한솥도시락',
      category: '한식',
      distance: 310,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 7,000원',
      hours: '10:00 ~ 17:00 (라스트오더 16:30)',
      address: '부산 사상구 주례로 58',
      phone: '051-311-1630',
      description: '스테디셀러 메가치킨마요와 정갈한 도시락이 매일 바쁜 캠퍼스 라이프를 든든하게 받쳐줍니다.',
      images: ['/images/한솥도시락 2.jpeg', '/images/한솥도시락 3.jpeg', '/images/한솥도시락 4.jpeg'],
      mapCoords: { lat: 35.1456, lng: 129.0102 },
      reviews: [
        { id: 2801, author: '한솥맨', avatar: '한', rating: 4.5, content: '미리 전화 주문하고 찾으러 가면 5초 만에 나옵니다. 바쁠 때 최고.', images: [], revisit: true, date: '2026-05-29', likes: 2 }
      ]
    },
    {
      id: 28,
      name: '개미분식',
      category: '분식',
      distance: 330,
      avgPrice: 5000,
      priceLevel: '4,000원 ~ 7,500원',
      hours: '09:30 ~ 20:30',
      address: '부산 사상구 주례로 56',
      phone: '051-326-5656',
      description: '부부 사장님이 운영하시는 정겹고 가성비 넘치는 즉석 떡볶이와 바삭한 납작만두.',
      images: ['/images/개미분식.jpeg', '/images/개미분식 2.jpeg'],
      mapCoords: { lat: 35.1454, lng: 129.0104 },
      reviews: [
        { id: 2901, author: '즉떡러', avatar: '즉', rating: 4.7, content: '라면 사리 듬뿍 넣은 옛날식 즉석 떡볶이 강추합니다. 볶음밥도 꼭 볶으세요!', images: [], revisit: true, date: '2026-06-01', likes: 6 }
      ]
    },
    {
      id: 29,
      name: '프랭크버거',
      category: '양식',
      distance: 600,
      avgPrice: 8000,
      priceLevel: '5,500원 ~ 12,000원',
      hours: '10:20 ~ 20:00',
      address: '부산 사상구 가야대로344번길 90 1층',
      phone: '051-314-9009',
      description: '100% 순소고기 수제 패티로 구워내 육즙이 가득하고 고소한 정통 아메리칸 스타일의 버거.',
      images: ['/images/프랭크버거.jpeg', '/images/프랭크버거 2.jpeg'],
      mapCoords: { lat: 35.1502, lng: 129.0135 },
      reviews: [
        { id: 3001, author: '버거킹탈퇴', avatar: '버', rating: 4.8, content: '패티에서 진한 소고기 불향이 납니다! 치즈 감튀도 꿀맛.', images: [], revisit: true, date: '2026-06-03', likes: 15 }
      ]
    },
    {
      id: 30,
      name: '신전떡볶이',
      category: '분식',
      distance: 620,
      avgPrice: 6500,
      priceLevel: '4,500원 ~ 9,000원',
      hours: '11:00 ~ 21:40',
      address: '부산 사상구 가야대로344번길 87',
      phone: '051-311-2140',
      description: '중독성 강한 시그니처 후추 매운맛 소스와 쫄깃한 밀떡, 바삭한 튀김오뎅의 대 환상 조합.',
      images: ['/images/신전떡볶이.jpeg', '/images/신전떡볶이 2.jpeg', '/images/신전떡볶이 3.jpeg'],
      mapCoords: { lat: 35.1501, lng: 129.0133 },
      reviews: [
        { id: 3101, author: '매운맛덕후', avatar: '매', rating: 4.9, content: '신전치즈김밥을 국물에 푹 찍어 먹으면 스트레스 다 풀립니다. 튀김어묵도 필수!', images: ['/images/신전떡볶이.jpeg'], revisit: true, date: '2026-06-02', likes: 20 }
      ]
    }
  ]);
  });

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
            reviews: [newReview, ...r.reviews]
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

  // Update user profile fields
  const updateProfile = (fields) => {
    setUser((prev) => ({
      ...prev,
      ...fields,
      // keep name in sync with nickname so review author names match
      name: fields.nickname ?? prev.nickname ?? prev.name
    }));
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

  useEffect(() => {
    localStorage.setItem('yumyum_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('yumyum_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateProfile,
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
