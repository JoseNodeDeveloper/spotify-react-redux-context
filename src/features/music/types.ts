/** API contract. Previously there were no types: `row.albumName` could be misspelled and nobody would notice. */
export interface AlbumSummary {
  albumName: string;
  coverUrl: string | null;
  releaseDate: string;
  totalTracks: number;
  popularity: number;
}

export interface SearchHistoryEntry {
  term: string;
  /** ISO 8601 */
  searchedAt: string;
}
