"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**@type {import("@/types/common")} */

/**
 * 
 * @param {Object} props
 * @param {StateControl<int>} props.page_control
 */
export function CustomPagination({
    className,

    total_pages,
    page_control
}) {
    const [page, set_page] = page_control
    if (total_pages < 1) return null;

    const goToPage = (p) => {
        if (p >= 1 && p <= total_pages) {
            set_page(p);
        }
    };

    // simple ellipsis logic
    const getPages = () => {
        if (total_pages <= 5) {
            return [...Array(total_pages).keys()].map((i) => i + 1);
        }

        if (page <= 3) return [1, 2, 3, "...", total_pages];
        if (page >= total_pages - 2)
            return [1, "...", total_pages - 2, total_pages - 1, total_pages];

        return [1, "...", page - 1, page, page + 1, "...", total_pages];
    };

    const pages = getPages();

    return (
        <Pagination className={className}>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => goToPage(page - 1)}
                        aria-disabled={page === 1}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page Links */}
                {pages.map((p, idx) => (
                    <PaginationItem key={idx}>
                        {p === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={p === page}
                                onClick={() => goToPage(p)}
                            >
                                <button>{p}</button>
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => goToPage(page + 1)}
                        aria-disabled={page === total_pages}
                        className={page === total_pages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
