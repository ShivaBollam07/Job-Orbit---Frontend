import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react'; // Import Lottie component
import animationData from "../assets/loginanimation.json"
import '../Styles/LoginForm.css';
import '../Styles/ToastStyles.css';
import loginlogoimage from '../assets/login.png';
import companyLogo from '../assets/jologo.png'; // Import your company logo

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      const response = await fetch('http://localhost:3000/app/v1/userauth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success(data.message, {
          className: 'custom-toast success'
        });
        console.log(data);
        setTimeout(() => {
          navigate('/home');
        }, 2000);

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
    <div className="login-form-container">

      

      <div className="lottie-animation">
        <Lottie animationData={animationData} loop autoplay />
      </div>

      <div className="login-form-wrapper">

        <ToastContainer
          className="custom-toast-container"
          toastClassName="custom-toast"
        />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <img src={loginlogoimage} alt="logo" className="logo" />
            <h2>Welcome Back</h2>
            <p>Lets explore the app again with us.</p>
          </div>
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
          <button type="submit">Login</button>
          <p className="signup-link">
            Dont have an account? <a href="/signup">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
