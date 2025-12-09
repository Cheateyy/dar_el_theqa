// Favorites page
import { ListingGrid } from "@/components/common/ListingGrid"
import { useEffect, useState } from "react"
import { get_favorites } from "../lib/api"

export function Favorites() {
    /**@type {StateControl<Listing[]>} */
    const [favorites, set_favorites] = useState([])

    useEffect(() => {
        async function fetch_data() {
            const data = await get_favorites()
            set_favorites(data.results)
        }
        fetch_data()
    }, [])
    return (
        <div>
            <section className="mx-20">
                <h1 className="h1 flex justify-center items-center">Favorite Listings</h1>
                <ListingGrid listings={favorites} />
            </section>
        </div>
    )
}