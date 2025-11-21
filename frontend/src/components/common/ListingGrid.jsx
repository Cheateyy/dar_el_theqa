import { ListingCard } from "./ListingCard"
import { CustomPagination } from "@/components/common/Pagination"

export function ListingGrid({ listings }) {
    if (!listings?.length) {
        return null;
    }
    return (
        <div>
            <div className="mt-10 grid grid-cols-4 gap-x-3 gap-y-9">
                {listings.map(() => <ListingCard />)}
            </div>
            <CustomPagination className="mt-14 mb-20" />
        </div>
    )
}
