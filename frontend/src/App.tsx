import { RouterProvider } from '@tanstack/react-router';
import { router } from './components/Arena/router';

export default function App() {
  return <RouterProvider router={router} />;
}
