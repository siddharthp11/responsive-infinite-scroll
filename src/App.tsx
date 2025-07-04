import { useCallback, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import classNames from "classnames";
import { useGifs } from "./query";
import { DebouncedInput } from "./components";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

function Page() {
  const [search, setSearch] = useState("");
  const { isFetching, fetchNextPage, hasNextPage, data } = useGifs(search);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isAtBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 200;
      if (hasNextPage && !isFetching && isAtBottom) fetchNextPage();
    },
    [hasNextPage, isFetching, fetchNextPage]
  );

  return (
    <div className="p-16 h-screen overflow-y-none">
      <h1 className="text-3xl font-semibold text-white">{"Todays Trending Gifs :)"}</h1>
      <DebouncedInput
        type="text"
        placeholder="Search for a gif"
        className="border-2 text-amber-100 p-2  border-white h-10 rounded-md my-6 w-1/2"
        onDebounceEnd={setSearch}
        delay={300}
      />
      <div
        className={classNames(
          "w-full h-5/6",
          !isFetching && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-y-scroll",
          isFetching && "flex justify-center items-center"
        )}
        onScroll={handleScroll}
      >
        {!isFetching ? (
          data.map((item) => <img key={item} src={item} />)
        ) : (
          <p className="text-white text-5xl">Loading...</p>
        )}
      </div>
    </div>
  );
}
