import React, { useState } from 'react';
import '../Styles/AddEducation.css';
import { toast } from 'react-toastify';

const AddEducation = ({ show, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [branch, setBranch] = useState('');
    const [degree, setDegree] = useState('');
    const [school, setSchool] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [grade, setGrade] = useState('');
    const [description, setDescription] = useState('');

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            if (
                name.trim() === '' ||
                branch.trim() === '' ||
                degree.trim() === '' ||
                school.trim() === '' ||
                startDate.trim() === '' ||
                endDate.trim() === '' ||
                description.trim() === ''
            ) {
                toast.error('All fields are required!', {
                    className: 'custom-toast error',
                });
                return;
            }

            const token = localStorage.getItem('token');
            const body = JSON.stringify({
                name,
                branch,
                degree,
                school,
                startDate,
                endDate,
                grade,
                description,
            });

            const response = await fetch('http://localhost:3000/app/v1/education/details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: body,
            });

            if (!response.ok) {
                throw new Error('Failed to add education');
            }

            const data = await response.json();
            toast.success('Education added successfully!', {
                className: 'custom-toast success',
            });

            onSubmit(); // Trigger parent component callback for submission completion
            handleClose(); // Close the modal and reset the form

        } catch (error) {
            console.error('Error adding education:', error);
            toast.error('Failed to add education', {
                className: 'custom-toast error',
            });
        }
    };

    const handleClose = () => {
        onClose(); // Close modal
        resetForm(); // Reset form fields
    };

    const resetForm = () => {
        setName('');
        setBranch('');
        setDegree('');
        setSchool('');
        setStartDate('');
        setEndDate('');
        setGrade('');
        setDescription('');
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={handleClose}>
                    &times;
                </span>
                <h2>Add Education</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your university..."
                />
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
                    placeholder="Enter your start date..."
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Enter your end date..."
                />
                <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Enter your grade..."
                />
                <textarea
                    value={description}
                    onChange={handleChange}
                    placeholder="Enter your education description..."
                    rows={4}
                />
                <button onClick={handleSubmit}>Add Education</button>
            </div>
        </div>
    );
};

export default AddEducation;
