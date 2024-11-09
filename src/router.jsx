import { createBrowserRouter } from 'react-router-dom';
import WebsiteLayout from './pages/__layouts/websiteLayout';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';


const router = createBrowserRouter([
  {
    path: '/',
    element: <WebsiteLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'play',
        element: <GameRoom />
      },
      {
        path: '*',
        element: <h1>404</h1>,
      },
    ],
  },
]);

export default router;