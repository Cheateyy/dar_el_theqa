import {
    Card,
} from "@/components/ui/card"
import listingCardImage from '@/assets/images/listing_card.jpg'
import heartSvg from '@/assets/images/heart.svg'
import isVerifiedListingSvg from '@/assets/images/verified_listing.svg'

export function ListingCard() {
    return (
        <Card
            style={{ backgroundImage: `url(${listingCardImage})` }}
            className="relative bg-cover bg-center rounded-4xl h-100 w-74 py-0 flex justify-end">
            <div className="absolute right-4 top-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <img src={heartSvg} alt="heart icon" />
                </div>
            </div>
            <div className="mb-4 text-white px-5" role="listing info">
                <div className="flex">
                    <div>
                        <p>Property title</p>
                        <p>Wilaya</p>
                    </div>
                    <img src={isVerifiedListingSvg} alt="is Verified Listing" className="ml-auto" />
                </div>
                <div className="mt-2">
                    <span>128928309809 DA</span>
                </div>
            </div>
        </Card>
    )
}
