import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { loggedOut, type AuthState } from "@/features/auth/authSlice";
import { env } from "@/shared/config/env";

/**
 * One shared HTTP client for the whole app.
 * Previously each service duplicated: read token from localStorage,
 * mutate `axios.defaults`, and a `.then/.catch` chain that returned errors
 * as if they were valid results. Now this logic lives here once.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.session?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/** If the API returns 401 (expired or invalid token), close the session automatically. */
const baseQueryWithLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(loggedOut());
  }
  return result;
};

/**
 * SERVER STATE: RTK Query handles cache, loading states,
 * request deduplication, and invalidation. Each feature adds endpoints
 * with `injectEndpoints`, so this file does not grow with every new screen.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["SearchHistory", "CurrentUser"],
  endpoints: () => ({}),
});
