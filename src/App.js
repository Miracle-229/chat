import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './auth/login/Login';
import Registration from './auth/registration/Registration';
import Chat from './features/Chat'

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" velement={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/chat" element={<Chat/>}/>
    </Routes>
  );
}

export default App;
