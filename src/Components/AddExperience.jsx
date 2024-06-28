import { useState } from 'react';
import '../Styles/AddExperience.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


const AddExperience = ({ show, onClose, onSubmit }) => {
  const [branch, setBranch] = useState('');
  const [job_role, setJob_role] = useState('');
  const [company, setCompany] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (
        branch.trim() === '' ||
        job_role.trim() === '' ||
        company.trim() === '' ||
        startDate.trim() === '' ||
        endDate.trim() === '' ||
        description.trim() === '' 
      ) {
        toast.error('All fields are required!', {
          className: 'custom-toast error',
        });
        return;
      }


      const body = JSON.stringify({ branch, job_role, company, startDate, endDate, description });
      const response = await fetch('http://localhost:3000/app/v1/experience/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body,
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit(description);
        toast.success('Successfully posted!', {
          className: 'custom-toast success',
        });

        setBranch('');
        setJob_role('');
        setCompany('');
        setStartDate('');
        setEndDate('');
        setDescription('');
         onClose();

      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`, {
          className: 'custom-toast error',
        });
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message, {
        className: 'custom-toast error',
      });
    }
  };

  return (
    <div className={`add-experience-modal ${show ? 'show' : ''}`}>

      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Experience</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter your company... "
          />
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Enter your branch..."
          />
          <input
            type="text"
            value={job_role}
            onChange={(e) => setJob_role(e.target.value)}
            placeholder="Enter your job role..."
          />

          <label>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <textarea
            value={description}
            onChange={handleChange}
            placeholder="Enter your experience description..."
            rows={4}
          />
      
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button submit-button" onClick={handleSubmit}>
            Add Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExperience;
