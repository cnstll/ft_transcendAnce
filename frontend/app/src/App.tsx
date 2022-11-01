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

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/play" element={<Play />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/2fa-sign-in" element={<SignIn2FA />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
