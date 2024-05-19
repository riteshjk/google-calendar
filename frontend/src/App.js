// src/App.js
import React, { useState,useEffect } from 'react';
import './App.css';
import MyCalendar from './component/Calender';
import Auth from './component/Auth';
import {  Route, Routes } from 'react-router-dom';
import Home from './component/Home';

// import {useNavigate} from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    setUser(user);
  };

  console.log(user)

  return (
    <div className="App">
      {/* {!user ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MyCalendar user={user}/>
      )} */}
      {/* <Auth/>
      <MyCalendar/> */}

      <Routes>
      <Route path="/" element={<Auth/>} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
