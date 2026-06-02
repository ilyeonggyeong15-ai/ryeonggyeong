import React, { useState } from 'react';
import MobileShell from './components/MobileShell';
import StartScreen from './screens/StartScreen';
import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
import ReviewWriter from './screens/ReviewWriter';
import MyPageScreen from './screens/MyPageScreen';
import { AppProvider } from './context/AppContext';

const App = () => {
  const [activeTab, setActiveTab] = useState('start'); // 'start', 'home', 'mypage'
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [isWritingReview, setIsWritingReview] = useState(false);

  // Determine whether to hide the bottom nav bar (e.g. in splash, detail view, or review writer)
  const hideNavBar = activeTab === 'start' || selectedRestaurantId !== null || isWritingReview;

  const renderContent = () => {
    if (activeTab === 'start') {
      return <StartScreen onStart={() => setActiveTab('home')} />;
    }

    if (isWritingReview && selectedRestaurantId) {
      return (
        <ReviewWriter
          restaurantId={selectedRestaurantId}
          onBack={() => setIsWritingReview(false)}
        />
      );
    }

    if (selectedRestaurantId) {
      return (
        <DetailScreen
          restaurantId={selectedRestaurantId}
          onBack={() => setSelectedRestaurantId(null)}
          onWriteReview={() => setIsWritingReview(true)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <MainScreen onSelectRestaurant={(id) => setSelectedRestaurantId(id)} />;
      case 'mypage':
        return <MyPageScreen onSelectRestaurant={(id) => {
          setActiveTab('home');
          setSelectedRestaurantId(id);
        }} />;
      default:
        return <MainScreen onSelectRestaurant={(id) => setSelectedRestaurantId(id)} />;
    }
  };

  return (
    <AppProvider>
      <MobileShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hideNavBar={hideNavBar}
      >
        {renderContent()}
      </MobileShell>
    </AppProvider>
  );
};

export default App;
