import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discoverMovies, getMovieGenres } from '@/services/tmdb';
import ContentGrid from '@/components/ContentGrid';
import GenreFilter from '@/components/GenreFilter';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/layout/PageHeader';

const Movies = () => {
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genres } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: getMovieGenres,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['discoverMovies', page, selectedGenre],
    queryFn: () => discoverMovies({ page, with_genres: selectedGenre || undefined }),
  });

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  return (
    <main className="px-4 pb-24 pt-28 md:px-12 md:pt-32">
      <PageHeader
        eyebrow="Library"
        title="Movies"
        description="Discover the latest and greatest films, handpicked from across the world."
      />

      {genres?.genres && (
        <div className="mb-8">
          <GenreFilter
            genres={genres.genres}
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreChange}
          />
        </div>
      )}

      <ContentGrid items={data?.results || []} type="movie" isLoading={isLoading} />

      {data && (
        <Pagination
          page={page}
          totalPages={data.total_pages}
          onChange={setPage}
        />
      )}
    </main>
  );
};

export default Movies;
