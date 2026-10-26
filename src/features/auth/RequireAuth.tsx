import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { isSessionValid, loggedOut, selectSession } from "./authSlice";

/**
 * Route guard. Important: this is UX, not security.
 * Real security is enforced on the server, which validates the token on every request.
 */
export function RequireAuth() {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const valid = isSessionValid(session);

  useEffect(() => {
    if (session && !valid) dispatch(loggedOut());
  }, [session, valid, dispatch]);

  if (!valid) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
