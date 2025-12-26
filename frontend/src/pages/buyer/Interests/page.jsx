// Interests page
import { ListingGrid } from "@/components/common/ListingGrid"
import { useEffect, useState } from "react"
import { get_contacted } from "../lib/api"

export function Interests() {
    /**@type {StateControl<Listing[]>} */
    const [listings, set_listings] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await get_contacted()
            set_listings(data.results ?? [])
        }
        fetchData()
    }, [])
    return (
        <div>
            <section className="mx-20">
                <h1 className="h1 flex justify-center items-center">Contacted Properties</h1>
                <ListingGrid listings={listings} />
            </section>
        </div>
    )
}