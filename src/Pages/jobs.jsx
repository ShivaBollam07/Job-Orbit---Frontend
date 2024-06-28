import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Jobs.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [link, setLink] = useState(null);
  const [isSending, setIsSending] = useState(false);  // State to manage sending status

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/app/v1/jobs/getAllJobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        setJobs(data); // Update state with fetched jobs
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Handle error state or display an error message in UI
      }
    };

    fetchJobs(); // Call fetchJobs function when component mounts
  }, []); // Empty dependency array ensures useEffect runs only once after initial render

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowUploadPopup(true);
  };

  const handleUploadResume = async () => {
    setIsSending(true); // Set isSending to true when the upload starts
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/app/v1/jobs/applyJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure content type is set to JSON
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          link,
          token
        })
      });

      if(response.ok){
        toast.success('Resume uploaded successfully', {
          className: 'custom-toast success'
        });
      }

      setLink('');
      //toast success message
      
      setShowUploadPopup(false);
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setIsSending(false); // Reset isSending to false after the upload completes
    }
  };

  return (
    <div>
    <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

      <div className="jobs-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          justifyContent: 'space-between',
          marginRight: '50%'
        }}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '1.5rem', color: 'black', cursor: 'pointer', marginRight: '50%' }} onClick={() => window.history.back()} />
          <h1 className="jobs-title"
            style={{
              textAlign: 'center',
              color: 'black',

            }}
          >Jobs</h1>
        </div>

        <div className="jobs-list">
          {jobs.map(job => (
            <div key={job.job_id} className="job-card">
              <h3
                style={{
                  color: 'black',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}
              >{job.role_needed}</h3>
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Description:</strong> {job.job_description}</p>
              <p><strong>Responsibilities:</strong> {job.role_responsibilities}</p>
              <p><strong>Skills Required:</strong> {job.skills_required}</p>
              <p><strong>Recruiter:</strong> {job.recruiter_name}</p>
              <p><strong>Contact Email:</strong> {job.company_email}</p>

              <button className="apply-button" onClick={() => handleApplyClick(job)}>Apply</button>
            </div>
          ))}
        </div>
      </div>

      {showUploadPopup && (
        <div className="upload-popup">
          <div className="upload-popup-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >

              <h2
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  color: 'black',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginTop: '1rem',
                  marginLeft: '20%'
                }}
              >Upload Resume Link</h2>
              <p
                style={{
                  display: 'block',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: 'black'
                }}
                onClick={() => setShowUploadPopup(false)}
              >
                <i className="fas fa-times"></i>
              </p>
            </div>
            <p
              style={{
                marginBottom: '1rem',
                color: 'black'
              }}
            >
              {selectedJob.role_needed} at {selectedJob.company_name}
            </p>
            <input 
              type="text"
              placeholder="Enter link"
              style={{
                width: '90%',
                padding: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
              onChange={(e) => setLink(e.target.value)}
            />
            <p style={{ fontSize: '0.8rem', color: 'gray' }}>Supported formats: PDF, DOC, DOCX</p>
            <button className="upload-button" onClick={handleUploadResume} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Resume'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
