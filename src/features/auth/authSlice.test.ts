import { authReducer, isSessionValid, loadSession, loggedOut, SESSION_STORAGE_KEY, sessionStarted } from './authSlice';

describe('authSlice', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts and ends the session', () => {
    const started = authReducer({ session: null }, sessionStarted({ accessToken: 't', expiresAt: 100 }));
    expect(started.session?.accessToken).toBe('t');
    expect(authReducer(started, loggedOut()).session).toBeNull();
  });

  it('discards a stored session that has already expired', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: 't', expiresAt: 1_000 }));
    expect(loadSession(2_000)).toBeNull();
    expect(loadSession(500)).toEqual({ accessToken: 't', expiresAt: 1_000 });
  });

  it('discards corrupted data without breaking the app', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{not json');
    expect(loadSession()).toBeNull();
  });

  it('treats an expired session as invalid', () => {
    expect(isSessionValid({ accessToken: 't', expiresAt: 10 }, 20)).toBe(false);
    expect(isSessionValid(null)).toBe(false);
  });
});
