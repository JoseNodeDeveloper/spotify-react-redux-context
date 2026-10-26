import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlbumsTable } from './AlbumsTable';
import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  it('submits the trimmed text when Enter is pressed', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} isSearching={false} />);

    await userEvent.type(screen.getByLabelText('Artist'), '  Rosalía  {Enter}');

    expect(onSearch).toHaveBeenCalledWith('Rosalía');
  });

  it('does not allow searching with an empty field', () => {
    render(<SearchForm onSearch={vi.fn()} isSearching={false} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
});

describe('AlbumsTable', () => {
  it('renders one row per album, with an accessible cover', () => {
    render(
      <AlbumsTable
        albums={[
          { albumName: 'Motomami', coverUrl: 'https://i.scdn.co/a.jpg', releaseDate: '2022-03-18', totalTracks: 16, popularity: 140 },
          { albumName: 'Los Ángeles', coverUrl: null, releaseDate: '2017', totalTracks: 11, popularity: 40 },
        ]}
      />,
    );

    expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2 albums
    expect(screen.getByAltText('Motomami cover')).toBeInTheDocument();
    expect(screen.getByText('2017')).toBeInTheDocument();
  });

  it('shows a message when there are no results', () => {
    render(<AlbumsTable albums={[]} />);
    expect(screen.getByText(/No albums found/)).toBeInTheDocument();
  });
});
