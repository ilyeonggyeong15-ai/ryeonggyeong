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
    university: '동서대학교',
    department: '인공지능학과 23학번',
    favoriteCategory: '분식'
  });

  // Main Restaurants Database matching the 31 campus places
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: '한솥도시락 (동서대점)',
      category: '한식',
      distance: 120,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 7,000원',
      hours: '10:00 ~ 17:00 (라스트오더 16:30)',
      address: '부산 사상구 주례로 58',
      phone: '051-322-1144',
      description: '가성비 최강 도시락 브랜드! 치킨마요와 도련님 도시락은 영원한 대학생의 든든한 한 끼 식사입니다.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.06, y: 0.05 },
      reviews: [
        { id: 101, author: '동서이즈', avatar: '동', rating: 4.8, content: '치킨마요 빅사이즈로 시키면 점심 내내 든든합니다. 가성비 최고!', images: [], revisit: true, date: '2026-06-01', likes: 12 }
      ]
    },
    {
      id: 2,
      name: '송산',
      category: '한식',
      distance: 280,
      avgPrice: 8500,
      priceLevel: '7,000원 ~ 12,000원',
      hours: '11:30 ~ 21:00',
      address: '부산 사상구 주례로 80 주례우진아파트',
      phone: '051-325-8855',
      description: '주례우진아파트 인근의 집밥 감성 든든한 정식 맛집. 엄마가 차려준 따뜻한 밥상과 찌개 맛을 느낄 수 있습니다.',
      images: ['/food_bunshik.png', '/food_japanese.png'],
      mapCoords: { x: -0.05, y: -0.06 },
      reviews: [
        { id: 201, author: '찌개요정', avatar: '찌', rating: 4.2, content: '김치찌개가 칼칼하고 반찬이 매일 바뀌어서 집밥 생각날 때마다 가요.', images: [], revisit: true, date: '2026-05-30', likes: 6 }
      ]
    },
    {
      id: 3,
      name: '또바기 김밥',
      category: '분식',
      distance: 310,
      avgPrice: 5000,
      priceLevel: '4,000원 ~ 7,000원',
      hours: '08:00 ~ 20:00 (라스트오더 19:20)',
      address: '부산 사상구 가야대로318번길 88 1층',
      phone: '051-312-3210',
      description: '가야대로 골목에 위치한 정성 가득한 김밥 전문점. 속이 아주 꽉 찬 뚱뚱이 김밥과 쫄면이 환상 궁합을 자랑합니다.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: -0.08, y: 0.08 },
      reviews: [
        { id: 301, author: '김밥러버', avatar: '김', rating: 5, content: '참치김밥 고소하고 떡볶이 국물에 찍어 먹으면 눈물 나게 맛있어요!', images: ['/food_bunshik.png'], revisit: true, date: '2026-06-02', likes: 18 }
      ]
    },
    {
      id: 4,
      name: '닭다구리',
      category: '야식',
      distance: 330,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 14,000원',
      hours: '16:00 ~ 24:00',
      address: '부산 사상구 가야대로318번길 85',
      phone: '051-323-5599',
      description: '저녁 야식으로 딱 좋은 닭갈비와 닭요리 전문점. 매콤한 양념에 볶아먹는 사리와 볶음밥이 대학생들에게 인기 만점입니다.',
      images: ['/food_japanese.png', '/food_bunshik.png'],
      mapCoords: { x: -0.09, y: 0.10 },
      reviews: [
        { id: 401, author: '닭사냥꾼', avatar: '닭', rating: 4.5, content: '시험 기간에 야식으로 시켜 먹기 딱 좋음. 양도 넉넉하고 닭고기가 부드러워요.', images: [], revisit: true, date: '2026-05-29', likes: 4 }
      ]
    },
    {
      id: 5,
      name: '화반',
      category: '한식',
      distance: 250,
      avgPrice: 8500,
      priceLevel: '7,500원 ~ 10,000원',
      hours: '10:30 ~ 20:30 (Break 15:00~16:00, 라스트오더 20:00)',
      address: '부산 사상구 주례로 76-1 1층',
      phone: '051-315-7610',
      description: '고기와 비빔밥이 정갈하고 푸짐하게 나오는 대학가 인기 밥집! 깔끔한 1인 트레이 서빙으로 위생적입니다.',
      images: ['/food_bunshik.png', '/food_pasta.png'],
      mapCoords: { x: -0.04, y: -0.04 },
      reviews: [
        { id: 501, author: '깔끔러', avatar: '깔', rating: 4.9, content: '비빔밥 고기 양도 많고 계란프라이도 두 개 올려줌!! 매장도 조용하고 위생적임.', images: [], revisit: true, date: '2026-06-02', likes: 15 }
      ]
    },
    {
      id: 6,
      name: '골라먹는 재미',
      category: '분식',
      distance: 220,
      avgPrice: 6000,
      priceLevel: '5,000원 ~ 8,000원',
      hours: '10:30 ~ 20:00',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-321-4477',
      description: '우진아파트 상가 골목에 위치한 뷔페식 한식/분식 밥집. 다양한 반찬을 골라 담을 수 있는 한 끼 실속 플레이트.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: -0.03, y: -0.02 },
      reviews: [
        { id: 601, author: '배고픈돼지', avatar: '배', rating: 4.0, content: '메뉴 고민될 때 그냥 여기 가면 다 해결됩니다. 양껏 먹을 수 있어 굳.', images: [], revisit: true, date: '2026-05-24', likes: 2 }
      ]
    },
    {
      id: 7,
      name: 'AVENDUTCH (아벤더치)',
      category: '카페',
      distance: 210,
      avgPrice: 3500,
      priceLevel: '2,000원 ~ 5,000원',
      hours: '08:00 ~ 19:30',
      address: '부산 사상구 주례로 77 3동 3호',
      phone: '051-325-1177',
      description: '저렴하고 컵 크기가 무지막지하게 큰 가성비 테이크아웃 커피 전문점. 등교길 아메리카노 수혈 필수 코스입니다.',
      images: ['/logo.png', '/food_pasta.png'],
      mapCoords: { x: -0.02, y: -0.02 },
      reviews: [
        { id: 701, author: '아아수혈기', avatar: '아', rating: 4.7, content: '여기 아아는 진짜 용량이 깡패입니다. 가격도 싸서 매일 들러요.', images: [], revisit: true, date: '2026-06-03', likes: 9 }
      ]
    },
    {
      id: 8,
      name: 'HEE:P (힙)',
      category: '카페',
      distance: 240,
      avgPrice: 5000,
      priceLevel: '4,500원 ~ 8,000원',
      hours: '11:00 ~ 22:00',
      address: '부산 사상구 주례로 76-1',
      phone: '051-316-7611',
      description: '힙하고 감각적인 인테리어와 음악이 있는 대학생 아지트 감성의 분위기 좋은 디저트 카페.',
      images: ['/food_pasta.png', '/logo.png'],
      mapCoords: { x: -0.03, y: -0.03 },
      reviews: [
        { id: 801, author: '인스타감성', avatar: '인', rating: 4.8, content: '크로플이랑 힙슈페너 강추합니다! 조명도 이뻐서 셀카 진짜 잘 나와요.', images: ['/food_pasta.png'], revisit: true, date: '2026-06-01', likes: 21 }
      ]
    },
    {
      id: 9,
      name: 'BARATO (바라토)',
      category: '양식',
      distance: 260,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 13,000원',
      hours: '10:30 ~ 19:30',
      address: '부산 사상구 주례로 79 우진아파트 상가',
      phone: '051-326-7900',
      description: '부담 없는 가격(Barato)에 정통 파스타와 필라프, 샐러드를 즐길 수 있는 양식 브랜드.',
      images: ['/food_pasta.png', '/food_japanese.png'],
      mapCoords: { x: -0.04, y: -0.05 },
      reviews: [
        { id: 901, author: '파스타매니아', avatar: '파', rating: 4.6, content: '토마토 오븐 파스타랑 베이컨 필라프 가성비 짱입니다. 무난하고 맛있어요.', images: [], revisit: true, date: '2026-05-28', likes: 7 }
      ]
    },
    {
      id: 10,
      name: '용빈각',
      category: '중식',
      distance: 230,
      avgPrice: 7000,
      priceLevel: '6,500원 ~ 10,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-314-2090',
      description: '총알 배달과 푸짐한 양으로 유명한 동네 터줏대감 중국집. 탕수육 세트는 동아리 모임 정석 메뉴.',
      images: ['/food_japanese.png', '/food_bunshik.png'],
      mapCoords: { x: -0.03, y: -0.03 },
      reviews: [
        { id: 1001, author: '신속배달', avatar: '신', rating: 4.2, content: '간짜장 시켰는데 면이 안 불고 엄청 빨리 옴. 소스 건더기가 푸짐해요.', images: [], revisit: true, date: '2026-05-27', likes: 3 }
      ]
    },
    {
      id: 11,
      name: '아레밀 (카페)',
      category: '카페',
      distance: 220,
      avgPrice: 4500,
      priceLevel: '3,500원 ~ 6,000원',
      hours: '11:00 ~ 22:00 (여름방학 + 겨울방학 기간 휴무)',
      address: '부산 사상구 주례로 77 주례우진아파트',
      phone: '051-325-7788',
      description: '학기 중에만 문을 여는 한정판 감성 카페! 달콤한 생크림 와플과 따뜻한 수제 차가 유명합니다.',
      images: ['/logo.png', '/food_pasta.png'],
      mapCoords: { x: -0.02, y: -0.03 },
      reviews: [
        { id: 1101, author: '방학슬퍼', avatar: '방', rating: 4.9, content: '여기 와플 진짜 겉바속촉 끝판왕인데 방학 땐 안 해서 학기 시작만 기다려요.', images: [], revisit: true, date: '2026-05-29', likes: 14 }
      ]
    },
    {
      id: 12,
      name: '경대 컵밥',
      category: '분식',
      distance: 240,
      avgPrice: 5000,
      priceLevel: '4,000원 ~ 6,500원',
      hours: '08:30 ~ 20:30',
      address: '부산 사상구 주례로 76',
      phone: '051-313-7600',
      description: '쉬는 시간 15분 안에 마스터 가능한 컵밥 전문점. 날치알과 김가루, 특제 소스가 입맛을 돋웁니다.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: -0.03, y: -0.04 },
      reviews: [
        { id: 1201, author: '바쁜학부생', avatar: '바', rating: 4.8, content: '모둠컵밥 하나 포장해서 우주공강 때 먹으면 꿀맛입니다. 소스 대박.', images: [], revisit: true, date: '2026-06-02', likes: 8 }
      ]
    },
    {
      id: 13,
      name: '꽃돼지국밥',
      category: '한식',
      distance: 200,
      avgPrice: 8500,
      priceLevel: '8,000원 ~ 9,500원',
      hours: '10:00 ~ 21:00 (라스트오더 20:30)',
      address: '부산 사상구 주례로 74 1층',
      phone: '051-322-7474',
      description: '부산의 정을 듬뿍 담은 뜨끈하고 뽀얀 돼지국밥. 고기가 뚝배기 가득 들어 있어 해장과 식사 둘 다 일품입니다.',
      images: ['/food_bunshik.png', '/food_japanese.png'],
      mapCoords: { x: -0.02, y: 0.01 },
      reviews: [
        { id: 1301, author: '해장귀신', avatar: '해', rating: 5, content: '부산 국밥집 탑티어 중 하나입니다. 국물이 진짜 맑고 고기 잡내가 하나도 안 나요.', images: [], revisit: true, date: '2026-05-31', likes: 25 }
      ]
    },
    {
      id: 14,
      name: '찬팅',
      category: '중식',
      distance: 195,
      avgPrice: 9000,
      priceLevel: '8,000원 ~ 15,000원',
      hours: '10:00 ~ 21:00',
      address: '부산 사상구 주례로 74 2층',
      phone: '051-314-7400',
      description: '알싸한 마라 맛을 좋아하는 대학생들을 위한 마라탕과 마라샹궈, 꿔바로우 전문 중식당.',
      images: ['/food_japanese.png', '/food_pasta.png'],
      mapCoords: { x: -0.02, y: 0.02 },
      reviews: [
        { id: 1401, author: '마라중독', avatar: '마', rating: 4.6, content: '꿔바로우 소스가 엄청 달콤새콤하고 마라탕 국물도 땅콩맛 찐하게 나서 맛있어요.', images: [], revisit: true, date: '2026-05-30', likes: 11 }
      ]
    },
    {
      id: 15,
      name: '꼬망',
      category: '분식',
      distance: 215,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 8,000원',
      hours: '10:30 ~ 20:00',
      address: '부산 사상구 주례로 77 우진아파트상가 9호',
      phone: '051-325-7709',
      description: '주머니 얇은 대학생들의 쉼터. 가성비 라면, 김밥, 떡볶이 콤보 세트가 메인입니다.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: -0.02, y: -0.03 },
      reviews: [
        { id: 1501, author: '라면도둑', avatar: '라', rating: 4.3, content: '라면 국물에 참밥 말아 먹으면 최고예요. 아기자기하고 친절합니다.', images: [], revisit: true, date: '2026-05-22', likes: 1 }
      ]
    },
    {
      id: 16,
      name: '엄마밥상',
      category: '한식',
      distance: 180,
      avgPrice: 7500,
      priceLevel: '7,000원 ~ 9,000원',
      hours: '10:00 ~ 20:00',
      address: '부산 사상구 주례로 72-1',
      phone: '051-323-7201',
      description: '할머니의 손맛이 살아있는 집밥 전문 식당. 된장찌개와 돼지불백 정식이 대학가 최고 인기.',
      images: ['/food_bunshik.png', '/food_japanese.png'],
      mapCoords: { x: -0.01, y: 0.03 },
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
      hours: '09:30 ~ 22:00 (매주 토요일 정기휴무)',
      address: '부산 사상구 주례로 72 카페란',
      phone: '051-315-7200',
      description: '조용하고 아늑한 분위기로 전공 서적 공부나 노트북 팀플 과제하기 좋은 카공족 추천 카페.',
      images: ['/logo.png', '/food_pasta.png'],
      mapCoords: { x: -0.01, y: 0.04 },
      reviews: [
        { id: 1701, author: '시험기간카공', avatar: '시', rating: 4.8, content: '콘센트 자리가 많고 조용해서 집중하기 최적화된 곳입니다. 말차라떼 맛있어요.', images: [], revisit: true, date: '2026-05-28', likes: 13 }
      ]
    },
    {
      id: 18,
      name: '한끼와 간식',
      category: '분식',
      distance: 160,
      avgPrice: 4500,
      priceLevel: '3,500원 ~ 6,500원',
      hours: '09:00 ~ 21:00',
      address: '부산 사상구 주례로 70',
      phone: '051-312-7000',
      description: '바쁜 등교길에 한 입 물고 갈 수 있는 따끈한 토스트와 와플, 수제 만두 간식집.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.00, y: 0.01 },
      reviews: [
        { id: 1801, author: '등굣길러너', avatar: '등', rating: 4.4, content: '햄치즈토스트가 2천원대라 아침 수업 전에 가볍게 때우기 너무 편함.', images: [], revisit: true, date: '2026-05-26', likes: 2 }
      ]
    },
    {
      id: 19,
      name: '평창메밀막국수',
      category: '한식',
      distance: 140,
      avgPrice: 8500,
      priceLevel: '8,000원 ~ 10,000원',
      hours: '11:00 ~ 20:00',
      address: '부산 사상구 주례로 68-1',
      phone: '051-328-6810',
      description: '여름철 더위를 싹 날려줄 메밀 물막국수와 비빔막국수. 메밀가루를 아낌없이 써서 쫄깃합니다.',
      images: ['/food_bunshik.png', '/food_japanese.png'],
      mapCoords: { x: 0.01, y: 0.01 },
      reviews: [
        { id: 1901, author: '여름조아', avatar: '여', rating: 4.7, content: '살얼음 동동 띄워진 육수가 환상적입니다. 감자만두 같이 시켜서 드세요.', images: [], revisit: true, date: '2026-06-03', likes: 10 }
      ]
    },
    {
      id: 20,
      name: '동경식사타임',
      category: '일식',
      distance: 130,
      avgPrice: 9500,
      priceLevel: '8,500원 ~ 12,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주례로 68',
      phone: '051-316-6800',
      description: '깔끔한 일본식 규동과 가츠동 전문점. 바삭하게 튀긴 돈까스와 비법 간장 소스가 스며든 덮밥 한 숟가락.',
      images: ['/food_japanese.png', '/food_pasta.png'],
      mapCoords: { x: 0.02, y: 0.01 },
      reviews: [
        { id: 2001, author: '돈부리파', avatar: '돈', rating: 4.6, content: '더블 가츠동 시켰는데 돈까스 크기가 대박이네요. 겉은 바삭하고 속은 부드러워요.', images: [], revisit: true, date: '2026-05-30', likes: 8 }
      ]
    },
    {
      id: 21,
      name: '냉정커피 (카페)',
      category: '카페',
      distance: 90,
      avgPrice: 3800,
      priceLevel: '2,500원 ~ 5,000원',
      hours: '09:00 ~ 18:00',
      address: '부산 사상구 주례로 45 KIT학생생활관 1관 1층',
      phone: '051-320-1111',
      description: '생활관 건물 내 입점하여 학생 및 기숙사생들의 필수 가성비 쉼터. 달콤한 모카와 라떼 전문점.',
      images: ['/logo.png', '/food_pasta.png'],
      mapCoords: { x: 0.08, y: 0.12 },
      reviews: [
        { id: 2101, author: '기숙사생', avatar: '기', rating: 4.9, content: '기숙사 바로 아래라 슬리퍼 끌고 테이크아웃 해오기 너무 개꿀입니다. 가성비 대만족.', images: [], revisit: true, date: '2026-06-03', likes: 16 }
      ]
    },
    {
      id: 22,
      name: '맛풍',
      category: '한식',
      distance: 100,
      avgPrice: 8000,
      priceLevel: '7,000원 ~ 10,000원',
      hours: '10:30 ~ 20:30',
      address: '부산 사상구 주례로 45',
      phone: '051-320-2222',
      description: '기숙사 골목 부근 한식 밥집. 뚝배기 제육과 참치 김치찌개는 매일 먹어도 질리지 않습니다.',
      images: ['/food_bunshik.png', '/food_japanese.png'],
      mapCoords: { x: 0.09, y: 0.11 },
      reviews: [
        { id: 2201, author: '프로혼밥러', avatar: '프', rating: 4.5, content: '제육이 완전 불맛나고 매콤해요. 대학가 한식당 중 손꼽히는 맛입니다.', images: [], revisit: true, date: '2026-05-29', likes: 5 }
      ]
    },
    {
      id: 23,
      name: '투가이즈',
      category: '양식',
      distance: 110,
      avgPrice: 12000,
      priceLevel: '10,000원 ~ 20,000원',
      hours: '11:30 ~ 21:00 (Break 15:00~17:00, 라스트오더 20:30)',
      address: '부산 사상구 주례로 64',
      phone: '051-315-6464',
      description: '피자 & 치킨 & 스파게티 콤보 세트로 유명한 캐주얼 양식당. 시험 끝난 날 친구들과 푸짐하게 파티하기 좋습니다.',
      images: ['/food_pasta.png', '/food_japanese.png'],
      mapCoords: { x: 0.04, y: 0.03 },
      reviews: [
        { id: 2301, author: '피치스', avatar: '피', rating: 4.8, content: '피자 도우가 완전 고소하고 순살 치킨도 바삭해요. 가격 대비 양이 어마무시합니다.', images: ['/food_pasta.png'], revisit: true, date: '2026-06-02', likes: 12 }
      ]
    },
    {
      id: 24,
      name: '황금룡',
      category: '중식',
      distance: 125,
      avgPrice: 7500,
      priceLevel: '6,500원 ~ 11,000원',
      hours: '11:00 ~ 20:00',
      address: '부산 사상구 주례로 62',
      phone: '051-321-6262',
      description: '얼큰한 국물과 풍성한 해물 양으로 정평이 난 짬뽕 맛집 중화요리 식당.',
      images: ['/food_japanese.png', '/food_bunshik.png'],
      mapCoords: { x: 0.05, y: 0.04 },
      reviews: [
        { id: 2401, author: '해물사랑', avatar: '해', rating: 4.3, content: '짜장면 소스가 진하고 면발이 부드럽습니다. 짬뽕엔 오징어랑 조개가 가득해요.', images: [], revisit: true, date: '2026-05-24', likes: 3 }
      ]
    },
    {
      id: 25,
      name: '이삭토스트',
      category: '분식',
      distance: 135,
      avgPrice: 4200,
      priceLevel: '3,000원 ~ 6,000원',
      hours: '11:00 ~ 18:00 (라스트오더 17:50)',
      address: '부산 사상구 주례로 60-1',
      phone: '051-326-6010',
      description: '달콤한 특제 키위 소스와 콘옥수수 계란 패티가 들어간 국민 간식 토스트 토크쇼.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.05, y: 0.05 },
      reviews: [
        { id: 2501, author: '이삭중독', avatar: '이', rating: 5, content: '햄스페셜 토스트에 아메리카노 마시면 점심 간단하게 해결 완료. 키위소스 사랑해요.', images: [], revisit: true, date: '2026-06-03', likes: 8 }
      ]
    },
    {
      id: 26,
      name: '봉숭아학당',
      category: '분식',
      distance: 145,
      avgPrice: 6500,
      priceLevel: '5,000원 ~ 9,000원',
      hours: '11:00 ~ 21:00',
      address: '부산 사상구 주레로 60',
      phone: '051-316-6000',
      description: '추억의 교실 컨셉 인테리어가 매력적인 복고 감성의 떡라면, 참치주먹밥 전문 분식집.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.06, y: 0.05 },
      reviews: [
        { id: 2601, author: '추억소환', avatar: '추', rating: 4.6, content: '주먹밥이 대접만 한 크기로 나와요. 라면 국물에 풀어먹으면 대박.', images: [], revisit: true, date: '2026-05-21', likes: 4 }
      ]
    },
    {
      id: 27,
      name: '봉구스 밥버거',
      category: '분식',
      distance: 150,
      avgPrice: 4000,
      priceLevel: '3,000원 ~ 5,500원',
      hours: '09:30 ~ 20:00',
      address: '부산 사상구 주례로 60',
      phone: '051-325-6000',
      description: '단돈 몇 천 원으로 누리는 확실한 김치 참치 마요 컵 밥버거 행복! 꾹 눌러 숟가락으로 떠먹는 재미.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.06, y: 0.06 },
      reviews: [
        { id: 2701, author: '봉구스맨', avatar: '봉', rating: 4.8, content: '치즈봉구세에 햄 추가하면 지상낙원입니다. 대학생 필수 코스.', images: [], revisit: true, date: '2026-05-28', likes: 7 }
      ]
    },
    {
      id: 28,
      name: '한솥도시락 (주례점)',
      category: '한식',
      distance: 160,
      avgPrice: 5500,
      priceLevel: '4,500원 ~ 7,000원',
      hours: '10:00 ~ 17:00 (라스트오더 16:30)',
      address: '부산 사상구 주례로 58',
      phone: '051-311-1630',
      description: '언제나 든든한 등굣길의 도시락. 한솥의 간판 메뉴인 메가치킨마요는 학생들의 스테디셀러.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.07, y: 0.06 },
      reviews: [
        { id: 2801, author: '한솥맨', avatar: '한', rating: 4.5, content: '미리 전화 주문하고 찾으러 가면 5초 만에 나옵니다. 바쁠 때 최고.', images: [], revisit: true, date: '2026-05-29', likes: 2 }
      ]
    },
    {
      id: 29,
      name: '개미분식',
      category: '분식',
      distance: 170,
      avgPrice: 5000,
      priceLevel: '4,000원 ~ 7,500원',
      hours: '09:30 ~ 20:30',
      address: '부산 사상구 주례로 56',
      phone: '051-326-5656',
      description: '부부 사장님이 운영하시는 정겨운 동네 즉석 떡볶이와 손만두 맛집 분식집.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.07, y: 0.07 },
      reviews: [
        { id: 2901, author: '즉떡러', avatar: '즉', rating: 4.7, content: '라면 사리 듬뿍 넣은 옛날식 즉석 떡볶이 강추합니다. 볶음밥도 꼭 볶으세요!', images: [], revisit: true, date: '2026-06-01', likes: 6 }
      ]
    },
    {
      id: 30,
      name: '프랭크버거',
      category: '양식',
      distance: 350,
      avgPrice: 8000,
      priceLevel: '5,500원 ~ 12,000원',
      hours: '10:20 ~ 20:00',
      address: '부산 사상구 가야대로344번길 90 1층',
      phone: '051-314-9009',
      description: '주문 즉시 구워내는 촉촉하고 고소한 육즙 가득 수제 소고기 패티와 정통 아메리칸 버거.',
      images: ['/food_pasta.png', '/food_japanese.png'],
      mapCoords: { x: 0.14, y: -0.09 },
      reviews: [
        { id: 3001, author: '버거킹탈퇴', avatar: '버', rating: 4.8, content: '패티에서 진한 소고기 불향이 납니다! 치즈 감튀도 꿀맛.', images: [], revisit: true, date: '2026-06-03', likes: 15 }
      ]
    },
    {
      id: 31,
      name: '신전떡볶이',
      category: '분식',
      distance: 360,
      avgPrice: 6500,
      priceLevel: '4,500원 ~ 9,000원',
      hours: '11:00 ~ 21:40',
      address: '부산 사상구 가야대로344번길 87',
      phone: '051-311-2140',
      description: '중독성 강한 매콤한 신전 양념과 쫄깃한 밀떡, 고소한 신전치즈김밥, 튀김오뎅 삼총사의 조화.',
      images: ['/food_bunshik.png', '/logo.png'],
      mapCoords: { x: 0.15, y: -0.10 },
      reviews: [
        { id: 3101, author: '매운맛덕후', avatar: '매', rating: 4.9, content: '신전치즈김밥을 국물에 푹 찍어 먹으면 스트레스 다 풀립니다. 튀김어묵도 필수!', images: ['/food_bunshik.png'], revisit: true, date: '2026-06-02', likes: 20 }
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
