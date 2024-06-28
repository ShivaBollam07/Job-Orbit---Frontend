import React, { useState, useEffect } from 'react';
import '../Styles/UpdateExperience.css';
import { toast } from 'react-toastify';

const UpdateExperience = ({ show, onClose, onSubmit, experienceId }) => {
  const [branch, setBranch] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');

  // Fetch existing experience data if experienceId is provided
  useEffect(() => {
    const fetchExperienceData = async () => {
      if (experienceId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/app/v1/experience/details/${experienceId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setBranch(data.branch || '');
            setJobRole(data.job_role || '');
            setCompany(data.company || '');
            setStartDate(data.startDate || '');
            setEndDate(data.endDate || '');
            setDescription(data.description || '');
            setSkills(data.skills ? data.skills.join(', ') : '');
          } else {
            const errorData = await response.json();
            console.error('Failed to fetch experience data:', errorData);
            toast.error('Failed to fetch experience data', { className: 'custom-toast error' });
          }
        } catch (error) {
          console.error('An error occurred while fetching experience data:', error.message);
          toast.error('Failed to fetch experience data', { className: 'custom-toast error' });
        }
      }
    };

    fetchExperienceData();
  }, [experienceId]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const body = {};

      if (branch.trim() !== '') {
        body.branch = branch;
      }

      if (jobRole.trim() !== '') {
        body.job_role = jobRole;
      }

      if (company.trim() !== '') {
        body.company = company;
      }

      if (startDate.trim() !== '') {
        body.startDate = startDate;
      }

      if (endDate.trim() !== '') {
        body.endDate = endDate;
      }

      if (description.trim() !== '') {
        body.description = description;
      }

      if(!company && branch){
        toast.error('Company is required if branch entered', {
          className: 'custom-toast error',
        });
        return;
      }

      if(!branch && company){
        toast.error('Branch is required if company entered', {
          className: 'custom-toast error',
        });
        return;
      }
      

      if (skills.trim() !== '') {
        const skillsArray = skills.split(',').map(skill => skill.trim());
        body.skills = skillsArray;
      }

      const response = await fetch(`http://localhost:3000/app/v1/experience/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...body, experienceId }), // Include experienceId in the request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Debugging line
        onSubmit(data); // Pass updated data to parent component
        toast.success('Experience updated successfully!', {
          className: 'custom-toast success',
        });
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Response error:', errorData); // Debugging line
        toast.error(`Error: ${errorData.error}`, {
          className: 'custom-toast error',
        });
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      toast.error('An error occurred: ' + error.message, {
        className: 'custom-toast error',
      });
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Experience</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <p className="note" style={{ color: 'red' }}>Note: Leave the fields you don't want to update empty</p>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Enter your branch..."
          />
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="Enter your job role..."
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter your company..."
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your experience description..."
            rows={4}
          />
        
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button submit-button" onClick={handleSubmit}>
            Update Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateExperience;
