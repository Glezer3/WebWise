import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export function LoggedIn() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Navigate to='/' /> : <Outlet />
}

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/signin' />;
}