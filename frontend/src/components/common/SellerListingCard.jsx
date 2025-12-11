import {
    Card,
} from "@/components/ui/card"
import listingCardImage from '@/assets/images/listing_card.jpg'

import editSvg from '@/assets/icons/edit.svg'
import menuKebakSvg from '@/assets/icons/menu_kebab.svg'

import isVerifiedSvg from '@/assets/icons/is_verified.svg'
import isPartiallyVerifiedSvg from '@/assets/icons/is_partially_verified.svg'
import { Button } from "../ui/button"
import { useListingsMessaging } from "@/pages/buyer/context/ListingsMessagingContext"
import { CustomDropdownMenu } from "./DropDownMenu"

import deleteSvg from "@/assets/icons/Delete.svg"

/** @typedef {import("@/types/ListingModel")}*/

/**
 * @param {Object} props
 * @param {Listing} props.listing 
 * @returns 
 */
export function SellerListingCard({ listing }) {
    const { open_update_listing_dlg } = useListingsMessaging()
    const { open_delete_listing_dlg } = useListingsMessaging()

    let verification_status_icon;
    let verification_status_str;
    let verification_status_color;

    switch (listing.verification_status) {
        case "VERIFIED":
            verification_status_icon = isVerifiedSvg;
            verification_status_str = "Pending"
            verification_status_color = 'yellow'
            break;
        case "PARTIAL":
            verification_status_icon = isPartiallyVerifiedSvg;
            verification_status_str = "Approved Pending"
            verification_status_color = 'purple'
            break;
        case "NONE":
            verification_status_icon = null;
            verification_status_str = "Approved"
            verification_status_color = 'green'
            break;
        default:
            console.error("ListingCard: unsupported verification status")
    }

    return (
        <Card
            style={{ backgroundImage: `url(${listingCardImage})` }}
            className="relative bg-cover bg-center rounded-4xl w-full sm:w-64 md:w-74 lg:w-80 h-56 sm:h-72 md:h-100 py-0 flex flex-col justify-end overflow-hidden"
        >
            {/* top-right action */}
            <div className="absolute right-3 top-3 sm:right-4 sm:top-4 flex gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700/80 flex items-center justify-center">
                    <button className="cursor-pointer hover:opacity-75" onClick={() => open_update_listing_dlg(listing.id)}>
                        <img src={editSvg} alt="edit" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                <CustomDropdownMenu asChild options={[{ label: "Delete", img: deleteSvg, onClick: () => open_delete_listing_dlg(listing.id) }]}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700/80 flex items-center justify-center">
                        <button className="cursor-pointer hover:opacity-75">
                            <img src={menuKebakSvg} alt="menu-kebab" className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </CustomDropdownMenu>

            </div>

            {/* gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="mb-3 text-white px-4 py-3 sm:px-5 sm:py-4 relative z-10" role="listing info">
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
                <div className="mt-2">
                    <Button className={`rounded-[80px] bg-${verification_status_color}-500`}>
                        {verification_status_str}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
