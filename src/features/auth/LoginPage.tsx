import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useLoginMutation } from "./authApi";

interface LocationState {
  from?: string;
  registered?: boolean;
}

export function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as LocationState;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // unwrap() throws when the request fails; the hook already exposes the error.
      await login({ email, password }).unwrap();
      navigate(state.from ?? "/", { replace: true });
    } catch {
      // Nothing else to do: hook `error` already contains the message.
    }
  };

  return (
    <main className="auth-card">
      <h1>Log in</h1>
      {state.registered ? (
        <p className="success">Account created. You can now log in.</p>
      ) : null}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <p role="alert">{getErrorMessage(error)}</p> : null}

        <button type="submit" disabled={isLoading || !email || !password}>
          {isLoading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </main>
  );
}
