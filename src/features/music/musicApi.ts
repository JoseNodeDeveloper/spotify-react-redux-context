import { baseApi } from "@/shared/api/baseApi";
import type { AlbumSummary, SearchHistoryEntry } from "./types";

export const musicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    artistAlbums: build.query<AlbumSummary[], string>({
      // encodeURIComponent: "AC/DC" must not break the URL. Previously text was concatenated unescaped.
      query: (artist) => `artists/${encodeURIComponent(artist)}/albums`,
      // Repeating a recent search does not call the API again for 10 minutes.
      keepUnusedDataFor: 600,
      async onQueryStarted(_artist, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // The server recorded the search: cached history is now stale.
          dispatch(musicApi.util.invalidateTags(["SearchHistory"]));
        } catch {
          // Error rendering is handled by the component.
        }
      },
    }),
    searchHistory: build.query<SearchHistoryEntry[], number>({
      query: (limit) => ({ url: "me/searches", params: { limit } }),
      providesTags: ["SearchHistory"],
    }),
  }),
});

export const { useArtistAlbumsQuery, useSearchHistoryQuery } = musicApi;
