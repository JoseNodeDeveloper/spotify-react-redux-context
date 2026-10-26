import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

/** Convert any API error into a user-friendly message. */
export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string | null {
  if (!error) return null;

  if ("status" in error) {
    if (error.status === "FETCH_ERROR")
      return "Could not connect to the server. Check your connection.";
    if (error.status === 429)
      return "Too many attempts. Wait a minute and try again.";
    if (error.status === 503)
      return "Spotify is not responding right now. Try again in a few minutes.";

    const data = error.data as { message?: unknown } | undefined;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(". ");
    return "Something went wrong. Please try again.";
  }

  return error.message ?? "Something went wrong. Please try again.";
}
