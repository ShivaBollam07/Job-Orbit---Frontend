import React, { useState } from 'react';
import Navbar from './Navbar';
import PostList from './PostList';
import ProfileDetails from './ProfileDetails';

const HomeScreen = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const handleProfileClick = () => {
    setShowProfileDetails(true);
  };

  const handleHomeClick = () => {
    setShowProfileDetails(false);
  };

  return (
    <div className="home-screen">
      <Navbar onProfileClick={handleProfileClick} />
      {showProfileDetails ? (
        <ProfileDetails />
      ) : (
        <PostList />
      )}
    </div>
  );
};

export default HomeScreen;
