import Movie from "@/components/movie/movies";
import SearchResult from "@/components/search/searchresult";

type Params = Promise<{ city: string; movie: string }>;

export default async function Index(params: Params) {
  const resolvedParams = await params;
  const { city, movie } = resolvedParams;

  if (city === "search") {
    return <SearchResult movie={movie} />;
  } else {
    return <Movie movie={movie} city={city} />;
  }
}
