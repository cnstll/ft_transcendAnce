import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import SignIn from './components/global-components/sign-in';
import Home from './components/global-components/home';
import Profile from './components/global-components/profile';
import Ranking from './components/global-components/ranking';
import Play from './components/global-components/play';
import Chat from './components/global-components/chat';
import PageNotFound from './components/global-components/page-not-found';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/play" element={<Play />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
