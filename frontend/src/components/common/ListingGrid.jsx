import { ListingCard } from "./ListingCard"
import { CustomPagination } from "@/components/common/Pagination"

/** @typedef {import("@/types/ListingModel")}*/

/**
 * 
 * @param {Object} props
 * @param {Listing[]} props.listings
 */
export function ListingGrid({ listings }) {
    if (!listings?.length) {
        return null;
    }
    return (
        <div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9">
                {listings.map((listing) => <ListingCard listing={listing} />)}
            </div>
            <CustomPagination className="mt-14 mb-20" />
        </div>
    )
}
