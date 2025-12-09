import { useEffect, useState } from "react";
import { ListingCard } from "./ListingCard"
import { CustomPagination } from "@/components/common/Pagination"

/**
 * 
 * @param {Object} props
 * @param {Listing[]} props.listings
 * @param {StateControl<int>} props.page_control
 */
export function ListingGrid({ listings, page_control }) {
    if (page_control) {
        return <ControlledListingGrid listings={listings} page_control={page_control} />
    }
    else {
        return <UncontrolledListingGrid listings={listings} />
    }
}

function ControlledListingGrid({ listings, page_control }) {
    const [page, set_page] = page_control
    useEffect(() => {
        console.log("Page: ", page)
    }, [page])

    if (!listings) {
        return null;
    }
    return (
        <div className="mt-8">
            {listings.length == 0 ?
                <p className="text-center p2">"No listings"</p> :

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9">

                    {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
                </div>
            }
            <CustomPagination className="mt-14 mb-20" page_control={[page, set_page]} total_pages={12} />
        </div>
    )
}

function UncontrolledListingGrid({ listings }) {
    const [page, set_page] = useState(1)
    useEffect(() => {
        console.log("Page: ", page)
    }, [page])

    if (!listings) {
        return null;
    }
    return (
        <div className="mt-8">
            {listings.length == 0 ?
                <p className="text-center p2">"No listings"</p> :
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-9">
                    {
                        listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
                </div>
            }
            <CustomPagination className="mt-14 mb-20" page_control={[page, set_page]} total_pages={12} />
        </div>
    )
}
