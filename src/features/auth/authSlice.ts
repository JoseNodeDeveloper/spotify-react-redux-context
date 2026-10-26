import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * GLOBAL CLIENT STATE: the session.
 * It lives in Redux because very different parts of the app need it
 * (protected routes, header, and API layer), and because updates should remain predictable and traceable.
 */
export interface Session {
  readonly accessToken: string;
  /** Timestamp (ms) when the token expires. */
  readonly expiresAt: number;
}

export interface AuthState {
  session: Session | null;
}

export const SESSION_STORAGE_KEY = "spotify-albums.session";

/**
 * Reads the stored session and discards it if corrupted or expired.
 * Uses sessionStorage (cleared when the tab closes) instead of localStorage.
 * See docs/adr/0003 for the token storage decision.
 */
export function loadSession(now: number = Date.now()): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "accessToken" in parsed &&
      "expiresAt" in parsed &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > now
    ) {
      return { accessToken: parsed.accessToken, expiresAt: parsed.expiresAt };
    }
    return null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: (): AuthState => ({ session: loadSession() }),
  reducers: {
    sessionStarted(state, action: PayloadAction<Session>) {
      state.session = action.payload;
    },
    loggedOut(state) {
      state.session = null;
    },
  },
});

export const { sessionStarted, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;

/** Typed selector against the minimal state shape to avoid importing the store and creating cycles. */
export const selectSession = (state: { auth: AuthState }): Session | null =>
  state.auth.session;

export const isSessionValid = (
  session: Session | null,
  now: number = Date.now(),
): session is Session => session !== null && session.expiresAt > now;
