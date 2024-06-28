import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Navbar.css'; 
import CreatePostModal from './CreatePostModal'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/jologo.png'; 

const Navbar = ({ onProfileClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitPost = (description) => {
    console.log('Post created:', description);
  };

  const handleLogoClick = () => {
    navigate('/home');
    window.location.reload(); 
    
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileOptionClick = () => {
    onProfileClick();
    setShowDropdown(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="navbar-links">
          <Link to="/jobs" className="navbar-link">Jobs</Link>
          <span className="navbar-link" onClick={handleCreatePost}>Create Post</span>
          <div className="navbar-profile" onClick={handleProfileClick}>
            <FontAwesomeIcon icon={faUser} className="profile-icon" />
            {showDropdown && (
              <div className="dropdown-menu">
                <span className="dropdown-item" onClick={handleProfileOptionClick}>Profile</span>
                <span className="dropdown-item" onClick={handleLogout}>Logout</span>
              </div>
            )}
          </div>
        </div>
      </nav>
      <CreatePostModal show={showModal} onClose={handleCloseModal} onSubmit={handleSubmitPost} />
    
    </div>
  );
};

export default Navbar;
