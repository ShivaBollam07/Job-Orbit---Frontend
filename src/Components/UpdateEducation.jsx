import React, { useState, useEffect } from 'react';
import '../Styles/UpdateEducation.css';
import { toast } from 'react-toastify';

const UpdateEducation = ({ show, onClose, onSubmit, educationId }) => {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [degree, setDegree] = useState('');
  const [school, setSchool] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');

  // Fetch existing education data if educationId is provided
  useEffect(() => {
    const fetchEducationData = async () => {
      if (educationId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/app/v1/education/details/${educationId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setName(data.name || '');
            setBranch(data.branch || '');
            setDegree(data.degree || '');
            setSchool(data.school || '');
            setStartDate(data.startDate || '');
            setEndDate(data.endDate || '');
            setGrade(data.grade || '');
            setDescription(data.description || '');
          } else {
            const errorData = await response.json();
            console.error('Failed to fetch education data:', errorData);
            toast.error('Failed to fetch education data', { className: 'custom-toast error' });
          }
        } catch (error) {
          console.error('An error occurred while fetching education data:', error.message);
          toast.error('Failed to fetch education data', { className: 'custom-toast error' });
        }
      }
    };

    fetchEducationData();
  }, [educationId]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const body = {};

    
      if (branch.trim() !== '') {
        body.branch = branch;
      }

      if (degree.trim() !== '') {
        body.degree = degree;
      }

      if (school.trim() !== '') {
        body.school = school;
      }

      if (startDate.trim() !== '') {
        body.startDate = startDate;
      }

      if (endDate.trim() !== '') {
        body.endDate = endDate;
      }

      if (grade.trim() !== '') {
        body.grade = grade;
      }

      if(!school && branch){
        toast.error('To chnage branch you should also enter name', {
          className: 'custom-toast error',
        });
        return;
      }

      if(!branch && school){
        toast.error('To chnage school you should also enter degree', {
          className: 'custom-toast error',
        });
        return;
      }

      

      if (description.trim() !== '') {
        body.description = description;
      }

     
    

      const response = await fetch(`http://localhost:3000/app/v1/education/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...body, educationId }), // Include educationId in the request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Debugging line
        onSubmit(data); // Pass updated data to parent component
        toast.success('Education updated successfully!', {
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
          <h2>Edit Education</h2>
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
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="Enter your degree..."
          />
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Enter your school..."
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
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter your grade..."
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your education description..."
            rows={4}
          />
          
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button submit-button" onClick={handleSubmit}>
            Update Education
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEducation;
