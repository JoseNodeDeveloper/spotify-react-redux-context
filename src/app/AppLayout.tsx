import { Outlet } from 'react-router';
import { useAppDispatch } from '@/app/hooks';
import { useCurrentUserQuery } from '@/features/auth/authApi';
import { loggedOut } from '@/features/auth/authSlice';
import { useTheme } from '@/shared/ui/ThemeContext';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const { data: user } = useCurrentUserQuery();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="topbar">
        <span className="brand">Albums</span>
        <div className="topbar__actions">
          {user ? <span className="muted">Hi, {user.username}</span> : null}
          <button type="button" className="ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button type="button" className="ghost" onClick={() => dispatch(loggedOut())}>
            Log out
          </button>
        </div>
      </header>
      <Outlet />
    </>
  );
}
