import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useMemo } from "react";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  const maxPageNumbers = 5;

  const pageNumbers = useMemo(() => {
    if (totalPages <= maxPageNumbers)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [];

    if (page > 3) pages.push(1, "...");

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...", totalPages);

    return pages;
  }, [page, totalPages]);

  return (
    <div className="flex justify-center items-center gap-2 my-6 text-lg font-medium">
      {/* Previous Button */}
      <button
        className="px-3 py-1 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-200"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        <GrFormPrevious size={20} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((p, index) => (
        <button
          key={index}
          className={`px-3 py-1 rounded-lg text-lg transition-all 
            ${
              p === page
                ? "bg-[#E8FCC9] text-[#35AF00] font-bold"
                : "hover:bg-gray-100"
            } 
            ${
              p === "..."
                ? "cursor-default pointer-events-none"
                : "cursor-pointer"
            }`}
          onClick={() => typeof p === "number" && setPage(p)}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        className="px-3 py-1 border rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-200"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        <GrFormNext size={20} />
      </button>
    </div>
  );
};

export default Pagination;
