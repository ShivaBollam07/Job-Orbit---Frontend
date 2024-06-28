/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/ToastStyles.css'; // Custom styles for Toasts
import HomeScreen from '../Components/HomeScreen';

const Home = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/'); 
        }
    }, [navigate]); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully', {
            className: 'custom-toast success'
        });
        navigate('/'); 
    };

    return (
        <div>
            <ToastContainer
                className="custom-toast-container"
                toastClassName="custom-toast"
            />
            <div >
                <HomeScreen />
            </div>
        </div>
    );
};

export default Home;
