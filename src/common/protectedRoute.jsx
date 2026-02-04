import { Navigate } from 'react-router-dom';

function protectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    alert('Please login first');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default protectedRoute;