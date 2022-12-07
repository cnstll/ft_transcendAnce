import { Route, Routes } from 'react-router-dom';
import './index.css';
import SignIn from './components/global-components/sign-in';
import Home from './components/global-components/home';
import Profile from './components/global-components/profile';
import Ranking from './components/global-components/ranking';
import Play from './components/global-components/play';
import Chat from './components/global-components/chat';
import PageNotFound from './components/global-components/page-not-found';
import SignIn2FA from './components/global-components/2fa-sign-in';
import Watch from './components/global-components/watch';
import { RequireAuth } from './components/global-components/routing-public-private';

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/ranking"
          element={
            <RequireAuth>
              <Ranking />
            </RequireAuth>
          }
        />
        <Route
          path="/play"
          element={
            <RequireAuth>
              <Play />
            </RequireAuth>
          }
        />
        <Route
          path="/watch/:playerId"
          element={
            <RequireAuth>
              <Watch />
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:activeChannel"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />
        <Route
          path="/2fa-sign-in"
          element={
            <RequireAuth>
              <SignIn2FA />
            </RequireAuth>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
