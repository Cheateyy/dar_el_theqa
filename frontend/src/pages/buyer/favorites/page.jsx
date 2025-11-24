// Favorites page
import { ListingGrid } from "@/components/common/ListingGrid"
import { BuyerHeader } from "../../buyer/components/Header"

export function Favorites() {
    const results = []
    for (let i = 0; i < 16; i++) {
        results.push(i)
    }
    return (
        <div>
            <section className="mx-20">
                <h1 className="h1 flex justify-center items-center">Favorite Listings</h1>
                <ListingGrid listings={results} />
            </section>
        </div>
    )
}