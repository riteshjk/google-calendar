// src/App.js
import React, { useState } from 'react';
import './App.css';
import MyCalendar from './component/Calender';
import Auth from './component/Auth';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setUser(user);
  };

  return (
    <div className="App">
      {/* {!user ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MyCalendar user={user} />
      )} */}
      <Auth/>
      <MyCalendar/>
    </div>
  );
}

export default App;
