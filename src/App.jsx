import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import NotFoundPage from './Components/NotFoundPage';
import Jobs from './Pages/jobs'

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element=  {<Jobs/>}/>
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
