import { memo } from 'react';
import type { AlbumSummary } from './types';

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function formatReleaseDate(value: string): string {
  // Spotify sometimes returns only the year ("2018") or year-month ("2018-05").
  if (/^\d{4}$/.test(value)) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

interface AlbumsTableProps {
  albums: readonly AlbumSummary[];
}

/**
 * `memo`: the table only re-renders when the album list changes,
 * not every time the user types in the search box.
 */
export const AlbumsTable = memo(function AlbumsTable({ albums }: AlbumsTableProps) {
  if (albums.length === 0) {
    return <p className="empty">No albums found for this artist. Try another name.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <caption className="visually-hidden">Albums sorted by popularity</caption>
        <thead>
          <tr>
            <th scope="col">Cover</th>
            <th scope="col">Album</th>
            <th scope="col">Tracks</th>
            <th scope="col">Release</th>
            <th scope="col">Popularity</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            // Stable, meaningful key; the array index was used before.
            <tr key={album.albumName}>
              <td>
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={`${album.albumName} cover`} width={48} height={48} loading="lazy" />
                ) : (
                  <span className="cover-placeholder" aria-hidden="true" />
                )}
              </td>
              <th scope="row">{album.albumName}</th>
              <td>{album.totalTracks}</td>
              <td>{formatReleaseDate(album.releaseDate)}</td>
              <td>{album.popularity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
