import { useEffect, useState } from "react";
import { ListingCard } from "./ListingCard"
import { CustomPagination } from "@/components/common/Pagination"

/** @typedef {import("@/types/ListingModel")}*/
/** @type {import('@/types/common')} */

/**
 * 
 * @param {Object} props
 * @param {Listing[]} props.listings
 * @param {StateControl<int>} props.page_control
 */
export function ListingGrid({ listings, page_control }) {
    const [page, set_page] = page_control
    useEffect(() => {
        console.log("Page: ", page)
    }, [page])

    if (!listings?.length) {
        return null;
    }
    return (
        <div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9">
                {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
            <CustomPagination className="mt-14 mb-20" page_control={[page, set_page]} total_pages={12} />
        </div>
    )
}
