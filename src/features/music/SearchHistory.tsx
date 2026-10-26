import { getErrorMessage } from "@/shared/api/errorMessage";
import { useSearchHistoryQuery } from "./musicApi";

interface SearchHistoryProps {
  onSelect: (term: string) => void;
}

/**
 * Small container component: it fetches its own data with an RTK Query hook.
 * Chips are buttons now, so selecting a previous search runs it again.
 */
export function SearchHistory({ onSelect }: SearchHistoryProps) {
  const { data = [], isLoading, error } = useSearchHistoryQuery(20);

  if (isLoading) return <p className="muted">Loading your searches…</p>;
  if (error) return <p role="alert">{getErrorMessage(error)}</p>;
  if (data.length === 0)
    return <p className="muted">You haven't searched for any artists yet.</p>;

  return (
    <section aria-labelledby="history-title">
      <h2 id="history-title">Your recent searches</h2>
      <ul className="chips">
        {data.map((entry) => (
          <li key={entry.term}>
            <button
              type="button"
              className="chip"
              onClick={() => onSelect(entry.term)}
            >
              {entry.term}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
