import { baseApi } from "@/shared/api/baseApi";
import { sessionStarted } from "./authSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  username: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: "Bearer";
  /** Seconds */
  expiresIn: number;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AccessTokenResponse, LoginRequest>({
      query: (body) => ({ url: "auth/login", method: "POST", body }),
      async onQueryStarted(_request, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            sessionStarted({
              accessToken: data.accessToken,
              expiresAt: Date.now() + data.expiresIn * 1000,
            }),
          );
        } catch {
          // The component reads the error from the hook; nothing else is needed here.
        }
      },
    }),
    register: build.mutation<{ userId: string }, RegisterRequest>({
      query: (body) => ({ url: "auth/register", method: "POST", body }),
    }),
    /**
     * Replaces the old `auth/getUser` call that hardcoded an email.
     * Now the server returns the user from the validated token.
     */
    currentUser: build.query<CurrentUser, void>({
      query: () => "auth/me",
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useCurrentUserQuery } =
  authApi;
