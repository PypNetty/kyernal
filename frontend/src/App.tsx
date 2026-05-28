import { RouterProvider } from '@tanstack/react-router';
import { router } from './features/arena/router';

export default function App() {
  return <RouterProvider router={router} />;
}
