import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useRegisterMutation } from "./authApi";

export function RegisterPage() {
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const update =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await register(form).unwrap();
      navigate("/login", { state: { registered: true } });
    } catch {
      // The component displays the message from `error`.
    }
  };

  return (
    <main className="auth-card">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          autoComplete="username"
          minLength={2}
          maxLength={20}
          required
          value={form.username}
          onChange={update("username")}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={72}
          required
          aria-describedby="password-hint"
          value={form.password}
          onChange={update("password")}
        />
        <p id="password-hint" className="hint">
          Between 10 and 72 characters, with letters and numbers.
        </p>

        {error ? <p role="alert">{getErrorMessage(error)}</p> : null}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
