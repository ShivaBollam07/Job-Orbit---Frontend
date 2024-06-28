import React, { useEffect, useState } from 'react';
import '../Styles/ProfileDetails.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddExperience from './AddExperience';
import UpdateExperience from './UpdateExperience';
import AddEducation from './AddEducation';
import UpdateEducation from './UpdateEducation';

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState(null);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showUpdateExperienceModal, setShowUpdateExperienceModal] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showUpdateEducationModal, setShowUpdateEducationModal] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState(null);

  const handleAddExperience = () => {
    setShowAddExperienceModal(true);
  };

  const handleCloseAddExperienceModal = () => {
    setShowAddExperienceModal(false);
  };

  const handleAddEducation = () => {
    setShowAddEducationModal(true);
  };

  const handleCloseAddEducationModal = () => {
    setShowAddEducationModal(false);
  };

  const handleExperienceSubmit = () => {
    fetchProfileData();
  };

  const handleEducationSubmit = () => {
    fetchProfileData();
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/app/v1/userauth/profile/getDetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div className="loading">Loading...</div>;
  }

  const { user, educationDetails, experienceDetails, skills } = profileData;

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const deleteEducation = async (education_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/app/v1/education/details', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ educationId: education_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete education');
      }

      toast.success('Education deleted successfully', {
        className: 'custom-toast success',
      });

      fetchProfileData();
    } catch (error) {
      toast.error('Failed to delete education', {
        className: 'custom-toast error',
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/app/v1/userauth/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success('Account deleted successfully', {
        className: 'custom-toast success',
      });

      localStorage.removeItem('token');
      window.location.href = '/';



    } catch (error) {
      toast.error('Failed to delete account', {
        className: 'custom-toast error',
      });
    }
  }

  const deleteExperience = async (experience_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/app/v1/experience/details', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experienceId: experience_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }

      toast.success('Experience deleted successfully', {
        className: 'custom-toast success',
      });

      fetchProfileData();
    } catch (error) {
      toast.error('Failed to delete experience', {
        className: 'custom-toast error',
      });
    }
  };

  const editExperience = (experience_id) => {
    setSelectedExperienceId(experience_id);
    setShowUpdateExperienceModal(true);
  };

  const editEducation = (education_id) => {
    setSelectedEducationId(education_id);
    setShowUpdateEducationModal(true);
  };

  const handleCloseUpdateEducationModal = () => {
    setShowUpdateEducationModal(false);
  };

  return (
    <div className="profile-details">
      <h1>User Profile</h1>
      <ToastContainer className="custom-toast-container" toastClassName="custom-toast" />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{getInitials(user.first_name, user.last_name)}</div>
          <div className="profile-info">
            <h2>{`${user.first_name} ${user.last_name}`}</h2>
            <p><i className="fas fa-envelope"></i> {user.email}</p>
            {user.website && <p><i className="fas fa-globe"></i> {user.website}</p>}
          </div>
        </div>

        <div className="add-buttons">
          <button onClick={handleAddEducation}><i className="fas fa-plus"></i> Add Education</button>
          <button onClick={handleAddExperience}><i className="fas fa-plus"></i> Add Experience</button>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          <div className="profile-details-list">
            {educationDetails.map((education) => (
              <div className="card" key={education.education_id}>
                <p className="school">School : {education.school}</p>
                <p className="degree">Degree : {education.degree}</p>
                <p className="start-date">Start Date : {education.start_date.substring(0, 10)}</p>
                <p className="end-date">End Date : {education.end_date.substring(0, 10)}</p>
                <p className="grade">Grade : {education.grade}</p>
                <p className="description">Description : {education.description}</p>
                <div className='iconis'>
                  <button onClick={() => editEducation(education.education_id)}><i className="fas fa-edit"></i> </button>
                  <button onClick={() => deleteEducation(education.education_id)}><i className="fas fa-trash-alt"></i> </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Experience</h3>
          <div className="profile-details-list">
            {experienceDetails.map((experience) => (
              <div className="card" key={experience.experience_id}>
                <p><strong>Company:</strong> {experience.company_name}</p>
                <p><strong>Job Role:</strong> {experience.job_role}</p>
                <p><strong>Start Date:</strong> {experience.start_date.substring(0, 10)}</p>
                <p><strong>End Date:</strong> {experience.end_date.substring(0, 10)}</p>
                <p><strong>Description:</strong> {experience.description}</p>
                <p><strong>Branch:</strong> {experience.company_branch}</p>
                <div className='iconis'>
                  <button onClick={() => editExperience(experience.experience_id)}><i className="fas fa-edit"></i> </button>
                  <button onClick={() => deleteExperience(experience.experience_id)}><i className="fas fa-trash-alt"></i> </button>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>

   

      {showAddExperienceModal && (
        <AddExperience
          show={showAddExperienceModal}
          onClose={handleCloseAddExperienceModal}
          onSubmit={handleExperienceSubmit}
        />
      )}

      {showUpdateExperienceModal && (
        <UpdateExperience
          show={showUpdateExperienceModal}
          onClose={() => setShowUpdateExperienceModal(false)}
          onSubmit={handleExperienceSubmit}
          experienceId={selectedExperienceId}
        />
      )}

      {showAddEducationModal && (
        <AddEducation
          show={showAddEducationModal}
          onClose={handleCloseAddEducationModal}
          onSubmit={handleEducationSubmit}
        />
      )}

      {showUpdateEducationModal && (
        <UpdateEducation
          show={showUpdateEducationModal}
          onClose={handleCloseUpdateEducationModal}
          onSubmit={handleEducationSubmit}
          educationId={selectedEducationId}
        />
      )}
    </div>
  );
};

export default ProfileDetails;
