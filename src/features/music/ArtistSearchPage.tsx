import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { AlbumsTable } from "./AlbumsTable";
import { useArtistAlbumsQuery } from "./musicApi";
import { SearchForm } from "./SearchForm";
import { SearchHistory } from "./SearchHistory";

/**
 * The page stores only one local value: the searched artist.
 * Everything else (results, loading, errors, history) comes from RTK Query.
 *
 * Previously: four useState calls, two useEffect calls, manual requests, and a Context
 * just to pass data to children, with no clear loading or error states.
 */
export function ArtistSearchPage() {
  const [artist, setArtist] = useState<string | null>(null);
  const {
    data: albums,
    isFetching,
    error,
  } = useArtistAlbumsQuery(artist ?? skipToken);

  return (
    <div className="page">
      <h1>Most popular albums</h1>
      <p className="muted">
        Search for an artist to see their albums ranked by the popularity of
        their tracks on Spotify.
      </p>

      <SearchForm onSearch={setArtist} isSearching={isFetching} />
      <SearchHistory onSelect={setArtist} />

      <section aria-live="polite" aria-busy={isFetching} className="results">
        {error ? <p role="alert">{getErrorMessage(error)}</p> : null}
        {artist && albums && !error ? (
          <>
            <h2>Results for “{artist}”</h2>
            <AlbumsTable albums={albums} />
          </>
        ) : null}
      </section>
    </div>
  );
}
