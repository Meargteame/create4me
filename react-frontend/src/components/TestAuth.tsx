import { useAuth } from '../contexts/AuthContext';

export function TestAuth() {
  const auth = useAuth();
  return <div>Test: {auth ? 'Auth loaded' : 'No auth'}</div>;
}
