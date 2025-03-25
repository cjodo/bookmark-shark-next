"use client"

import { Pagination } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface PaginateProps {
  maxPages: number
}

export const Paginate = ({ maxPages }: PaginateProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Initialize page from the query parameter when the component mounts
    const pageParam = searchParams.get("page");
    if (pageParam && !isNaN(parseInt(pageParam))) {
      setPage(Math.min(parseInt(pageParam), maxPages));  // Ensure it's within the range
    }
  }, [searchParams, maxPages]);  // This only runs once when the component mounts

  const handleChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    // Avoid updating the state if the page number is the same as the current one
    if (newPage === page) return;

    // Update state for page number
    setPage(newPage);

    // Update the URL query parameter with the new page
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', newPage.toString());

    // Push new URL with updated page number
    router.push(`?${currentParams.toString()}`);
  };

  return (
		<div className="flex max-w-[1440px] p-3 items-center justify-center">
			<Pagination
				count={maxPages}
				page={page}
				color="secondary"
				onChange={handleChange}
			/>
		</div>
  );
};

