import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    BrowserRouter as Router,
    Route,
    Routes,
  } from "react-router-dom";
import './index.css';
import SignIn from './components/global-components/sign-in';
import Home from './components/global-components/home';
import Profile from './components/global-components/profile';
import Ranking from './components/global-components/ranking';
import Play from './components/global-components/play';
import Chat from './components/global-components/chat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path ="/" element={<Home />} />
            <Route path ="/sign-in" element={<SignIn />} />
            <Route path ="/profile" element={<Profile />} />
            <Route path ="/ranking" element={<Ranking />} />
            <Route path ="/play" element={<Play />} />
            <Route path ="/chat" element={<Chat />} />
        </Routes>
    </BrowserRouter>
);