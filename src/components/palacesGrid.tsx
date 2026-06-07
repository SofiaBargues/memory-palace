"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Loader } from "./Loader";
import PalaceCard from "./PalaceCard";
import { MongoPalace } from "@/mongodb/models/palace";

const PAGE_SIZE = 8;

type PalacesResponse = {
  success: boolean;
  data: MongoPalace[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  message?: string;
};

const RenderCards = ({ data }: { data: MongoPalace[] }) => {
  if (data?.length > 0) {
    return (
      <div className="grid-cols-1  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 grid">
        {data.map((palace) => (
          <PalaceCard key={palace._id} palace={palace} />
        ))}
      </div>
    );
  }

  return <div className="text-center text-muted-foreground">No palaces found</div>;
};

export default function PalacesGrid({ maxNum }: { maxNum?: number }) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allPalaces, setAllPalaces] = useState<MongoPalace[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const limit = maxNum ?? PAGE_SIZE;

  useEffect(() => {
    const controller = new AbortController();
    const fetchPalaces = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        setError(null);
        const response = await fetch(`/api/v1/palace?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        const result = (await response.json()) as PalacesResponse;

        if (response.ok) {
          setAllPalaces((currentPalaces) => {
            if (page === 1) return result.data;

            const existingIds = new Set(
              currentPalaces.map((palace) => palace._id.toString())
            );
            const nextPalaces = result.data.filter(
              (palace) => !existingIds.has(palace._id.toString())
            );

            return [...currentPalaces, ...nextPalaces];
          });
          setHasMore(result.pagination?.hasMore ?? false);
        } else {
          throw new Error(result.message || "Error en la solicitud");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError((error as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchPalaces();

    return () => controller.abort();
  }, [limit, page]);

  useEffect(() => {
    if (maxNum || loading || loadingMore || !hasMore) return;

    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((currentPage) => currentPage + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, maxNum]);

  const visiblePalaces = useMemo(
    () => (maxNum ? allPalaces.slice(0, maxNum) : allPalaces),
    [allPalaces, maxNum]
  );

  return (
    <div id="Grid" className="flex flex-1 flex-col p-4 sm:p-12">
      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Loader />
          <p className="font-medium  mt-5 text-xl">Loading Palaces</p>
        </div>
      ) : (
        <>
          {error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : null}
          <RenderCards data={visiblePalaces} />
          {!maxNum ? (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {loadingMore ? (
                <div className="flex flex-col items-center">
                  <Loader />
                  <p className="mt-4 font-medium">Loading more palaces</p>
                </div>
              ) : hasMore ? (
                <span className="sr-only">Load more palaces</span>
              ) : allPalaces.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have reached the end.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
