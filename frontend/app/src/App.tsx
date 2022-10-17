import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const [data, setData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  /**
   * Function to get the user data from the authentification with 42 API
   * If the data were not fetched the user is redirected to the sign in page
   */

  useEffect(() => {
    axios
      .get<UserData>('http://localhost:3000/user/fetch-user', {
        withCredentials: true,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        navigate('/sign-in');
        setData(null);
      });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={data && <Home avatarImg={data.avatarImg} />} />
        <Route
          path="/profile"
          element={
            data && (
              <Profile avatarImg={data.avatarImg} nickName={data.nickName} />
            )
          }
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
    </>
  );
}

export default App;
