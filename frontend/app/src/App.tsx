import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import SignIn from './components/global-components/sign-in';
import Home from './components/global-components/home';
import Profile from './components/global-components/profile';
import Ranking from './components/global-components/ranking';
import Play from './components/global-components/play';
import Chat from './components/global-components/chat';
import PageNotFound from './components/global-components/page-not-found';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { UserData } from './components/global-components/interface';

function App() {
  // const [loggedIn, setLoggedin] = useState(false);
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    // setLoggedin(true);
    axios
      .get<UserData>('http://localhost:3000/user/fetch-user', {
        withCredentials: true,
      })
      .then((response) => {
        setData(response.data);
        if (!data) <Navigate to="/sign-in" replace />;
      })
      .catch((error) => {
        console.log(error);
        // setLoggedin(false);
        setData(null);
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={data && <Home avatarImg={data.avatarImg} />}
          />
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/profile/:id"
            element={data && <Profile avatarImg={data.avatarImg} />}
          />
          <Route
            path="/ranking"
            element={data && <Ranking avatarImg={data.avatarImg} />}
          />
          <Route
            path="/play"
            element={data && <Play avatarImg={data.avatarImg} />}
          />
          <Route
            path="/chat"
            element={data && <Chat avatarImg={data.avatarImg} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
