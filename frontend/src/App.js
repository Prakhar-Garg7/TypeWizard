import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import { useAuth } from './contexts/AuthContext';
import Result from './Pages/Result/Result';
import LeaderBoard from './Pages/LeaderBoard/LeaderBoard';
import Game1 from './Pages/Game1/Game1';

const App = () => {
  const {isAuthenticated} = useAuth();
  return <Router>
    <Routes>
      <Route path='/' element={!isAuthenticated ? <Register/> : <Navigate to='/dashboard' />}></Route>
      <Route path='/login' element={!isAuthenticated ? <Login/> : <Navigate to='/dashboard' />}></Route>
      <Route path='/dashboard' element={isAuthenticated ? <Dashboard/> : <Login/>}></Route>
      <Route path='/result' element={<Result/>}></Route>
      <Route path='/leaderBoard' element={<LeaderBoard/>}></Route>
      <Route path='/game' element={<Game1/>}></Route>
    </Routes>
  </Router>
}

export default App;