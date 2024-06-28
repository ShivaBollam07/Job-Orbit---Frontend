import React, { useState } from 'react';
import '../Styles/CreatePostModal.css'; // Import your CSS file for modal styling
import { toast } from 'react-toastify';

const CreatePostModal = ({ show, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate if description is not empty (add more validation as needed)
      if (description.trim() === '') {
        toast.error('Description cannot be empty!', {
          className: 'custom-toast error'
        });
        return;
      }

      // Example API request using fetch
      const response = await fetch('http://localhost:3000/app/v1/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual token handling logic
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit(description); // Notify parent component of successful post creation
        toast.success('Successfully posted!', {
          className: 'custom-toast success'
        });
        // Reload the window after successful post creation
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to create post', {
          className: 'custom-toast error'
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('An error occurred: ' + error.message, {
        className: 'custom-toast error'
      });
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Create Post</h2>
        <textarea
        className="description"
          value={description}
          onChange={handleChange}
          placeholder="Enter your post description..."
          rows={4}
        />
        <button onClick={handleSubmit}>Create Post</button>
      </div>
    </div>
  );
};

export default CreatePostModal;
