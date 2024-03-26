import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import reportWebVitals from './reportWebVitals';
import Room from './components/room/Room';
import Home from './components/home/Home';
import TestRoom from './components/test-room/TestRoom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/board/:roomCode',
    element: <Room />
  },
  {
    path: '/test-board/:roomCode',
    element: <TestRoom />
  }
]);

root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
