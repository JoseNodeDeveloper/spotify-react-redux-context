import { createBrowserRouter, Link } from "react-router";
import { LoginPage } from "@/features/auth/LoginPage";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { AppLayout } from "./AppLayout";

function NotFound() {
  return (
    <main className="auth-card">
      <h1>Page not found</h1>
      <Link to="/">Back to home</Link>
    </main>
  );
}

/**
 * Routes use lazy loading (`lazy`): each page's code is downloaded only when visited.
 * The login screen is the entry point, so it stays in the initial bundle.
 */
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/register",
    lazy: async () => ({
      Component: (await import("@/features/auth/RegisterPage")).RegisterPage,
    }),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("@/features/music/ArtistSearchPage"))
                .ArtistSearchPage,
            }),
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
