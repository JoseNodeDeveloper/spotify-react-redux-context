import { useId, useState, type FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (artist: string) => void;
  isSearching: boolean;
}

/**
 * Presentational component: it knows nothing about Redux or the API.
 * It receives data through props and reports back with callbacks, so it is easy to reuse and test.
 */
export function SearchForm({ onSearch, isSearching }: SearchFormProps) {
  const [value, setValue] = useState('');
  const inputId = useId();
  const term = value.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Previously the button was not inside a real form submit: pressing Enter did not search.
    event.preventDefault();
    if (term) onSearch(term);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} role="search">
      <label htmlFor={inputId}>Artist</label>
      <div className="search-form__row">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="For example, Rosalía"
          maxLength={100}
          autoComplete="off"
        />
        <button type="submit" disabled={!term || isSearching}>
          {isSearching ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
}
