import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import animationData from '../assets/signupanimation.json';
import '../Styles/SignUpForm.css';
import '../Styles/ToastStyles.css';
import loginlogoimage from '../assets/image.png';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    website: '',
    firstName: '',
    middleName: '',
    lastName: '',
    about: '',
    password: '',
    confirmpassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      toast.error('Passwords do not match', {
        className: 'custom-toast error'
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/app/v1/userauth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, {
          className: 'custom-toast success'
        });
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } else {
        toast.error(data.error || 'An error occurred', {
          className: 'custom-toast error'
        });
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message, {
        className: 'custom-toast error'
      });
    }
  };

  return (
    <div className='maincontainer'>
      <ToastContainer 
        className="custom-toast-container" 
        toastClassName="custom-toast"
      /> 
   
      <div className="signup-form-container">
        <div className="animation-container">
          <Lottie animationData={animationData} className="lottie-animation" />
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-header">
            <div className='form-header-mini'>
              <img src={loginlogoimage} alt="logo" className="logo" />
              <h2 className="form-title">Sign Up</h2>
              <h3 className="form-subtitle">Create your account to get started</h3>
            </div>
          </div>
          <div className="form-columns">
            <div className="form-column">

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  placeholder="Enter your middle name"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  placeholder="Enter your website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="about">About</label>
                <input
                  type="text"
                  id="about"
                  name="about"
                  placeholder="Something about yourself"
                  value={formData.about}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmpassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="Confirm your password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <button type="submit">Sign Up</button>
          <p className="signup-link">
            Already have an account? <a href="/">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
