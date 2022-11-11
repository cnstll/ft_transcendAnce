import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 5 * 1000,
    },
  },
});


// if (process.env.REACT_APP_API_URL === undefined?  process.env.REACT_APP_BACKEND_URL : 'oops');

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      { process.env.REACT_APP_BACKEND_URL === undefined && 
        <p> your env ain't right </p> 
    }
      { process.env.REACT_APP_BACKEND_URL !== undefined && 
        <App />
    } 
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
