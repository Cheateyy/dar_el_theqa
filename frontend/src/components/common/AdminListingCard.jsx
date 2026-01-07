import {
    Card,
} from "@/components/ui/card"
import listingCardImage from '@/assets/images/listing_card.jpg'

import showSvg from '@/assets/icons/show.svg'
import isVerifiedSvg from '@/assets/icons/is_verified.svg'
import isPartiallyVerifiedSvg from '@/assets/icons/is_partially_verified.svg'
import { useNavigate } from "react-router-dom"
import { OFFER_TYPE } from "@/pages/buyer/enum"
import { exec_stop_propagation_proxy } from "@/lib/utils"

/**
 * @param {Object} props
 * @param {Listing} props.listing 
 * @returns 
 */
export function AdminListingCard({ listing }) {
    const navigate = useNavigate()

    let verification_status_icon;
    switch (listing.verification_status) {
        case "VERIFIED":
            verification_status_icon = isVerifiedSvg;
            break;
        case "PARTIAL":
            verification_status_icon = isPartiallyVerifiedSvg;
            break;
        case "NONE":
            verification_status_icon = null;
            break;
        default:
            console.error("ListingCard: unsupported verification status")
    }

    function handle_preview(e) {
        const transaction_type = listing.transaction_type == OFFER_TYPE.BUY ? "Sell" : "Rent"
        exec_stop_propagation_proxy(e, () => {
            const url = `/details/admingListing${transaction_type}/${listing.id}`
            navigate(url)
        })
    }

    return (
        <Card
            style={{ backgroundImage: `url(${listingCardImage})` }}
            className="relative bg-cover bg-center rounded-4xl max-w-80 h-56 sm:h-72 md:h-100 py-0 flex flex-col justify-end overflow-hidden"
        >
            {/* top-right action */}
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700/80 flex items-center justify-center">
                    <button className="cursor-pointer hover:opacity-75" onClick={handle_preview}>
                        <img src={showSvg} alt="preview" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                </div>
            </div>

            {/* gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div role="listing info" className="mb-3 text-white px-4 py-3 sm:px-5 sm:py-4 relative z-10">
                <div className="flex items-start gap-3">
                    <div className="min-w-0">
                        <p className="text-sm sm:text-base font-medium truncate">{listing.title}</p>
                        <p className="text-xs sm:text-sm text-gray-200 truncate">{listing.wilaya}</p>
                    </div>
                    {verification_status_icon && <img src={verification_status_icon} alt="verified" className="ml-auto" />}
                </div>
                <div className="mt-2">
                    <span className="text-base sm:text-lg font-semibold">{listing.price}</span>
                </div>
            </div>
        </Card>
    )
}
