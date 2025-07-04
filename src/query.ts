import { useInfiniteQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

const api_key = 'tKe4eacDnb8czalBaIVsAqO41Sq6GjyV';
const api = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
});

export interface ImageGif {
  images: {
    original: {
      url: string;
    };
  };
}
export interface GifResponse {
  data: ImageGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

async function getGifs({
  pageParam = 0,
  search: q,
  signal,
}: {
  pageParam: number;
  search?: string;
  signal: AbortSignal;
}) {
  const url = q ? "/search" : "/trending";
  const { data } = await api.get<GifResponse>(url, {
    params: {
      limit: 20,
      offset: pageParam,
      api_key,
      q,
    },
    signal,
  });
  return data;
}

const initialData = {
  pages: [
    {
      data: [] as ImageGif[],
      pagination: {
        total_count: 0,
        count: 0,
        offset: 0,
      },
    },
  ],
  pageParams: [0],
};

export function useGifs(search: string) {
  const {data, ...rest} = useInfiniteQuery({
    queryKey: ["gifs", search],
    queryFn: ({ pageParam = 0, signal }) =>
      getGifs({ pageParam, search, signal }),
    getNextPageParam: ({ pagination: { total_count, offset, count } }) =>
      total_count ? offset + count : undefined,
    initialPageParam: 0,
    initialData,
    placeholderData: keepPreviousData,
  });

  const urls: string[] = useMemo(
    () =>
      data.pages
        .flatMap((page) => page.data)
        .map((img) => img.images.original.url),
    [data.pages]
  );
 
  return {...rest, data: urls};
}
