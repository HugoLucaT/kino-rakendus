import Movie from "@/components/movie/movies";
import SearchResult from "@/components/search/searchresult";

export default function Index({
  params,
}: {
  params: { city: string; movie: string };
}) {
  const { city, movie } = params;

  if (city === "search") {
    return (
      <>
        <SearchResult movie={movie} />
      </>
    );
  } else {
    return (
      <>
        <Movie movie={movie} city={city} />
      </>
    );
  }
}
