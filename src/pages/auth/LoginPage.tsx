// ─── Authentication Login Page ──────────────────────────────────────────────

import { useNavigate, useLocation } from 'react-router-dom';
import { LoginPage as LoginFormComponent } from '../../components/auth/LoginPage';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return <LoginFormComponent onSuccess={handleSuccess} />;
}
