import { Route, Routes } from 'react-router-dom';
import './index.css';
import SignIn from './components/global-components/sign-in';
import Home from './components/global-components/home';
import Profile from './components/global-components/profile';
import Ranking from './components/global-components/ranking';
import Play from './components/global-components/play';
import Chat from './components/global-components/chat';
import PageNotFound from './components/global-components/page-not-found';
import useUser from './components/customed-hooks/useUser';

function App() {
  const user = useUser();
  return (
    <>
      {console.log({ e: user.isError })}
      {console.log({ e: user.isLoading })}
      {console.log({ e: user })}
      <Routes>
        {user.isLoading && <Route path="/sign-in" element={<SignIn />} />}
        {user.isError && <Route path="/sign-in" element={<SignIn />} />}
        <Route
          path="/"
          element={user.isSuccess && <Home avatarImg={user.data.avatarImg} />}
        />
        <Route
          path="/profile"
          element={
            user.isSuccess && (
              <Profile
                avatarImg={user.data.avatarImg}
                nickName={user.data.nickname}
              />
            )
          }
        />
        <Route
          path="/ranking"
          element={
            user.isSuccess && <Ranking avatarImg={user.data.avatarImg} />
          }
        />
        <Route
          path="/play"
          element={user.isSuccess && <Play avatarImg={user.data.avatarImg} />}
        />
        <Route
          path="/chat"
          element={user.isSuccess && <Chat avatarImg={user.data.avatarImg} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
