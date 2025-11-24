// Interests page
import { ListingGrid } from "@/components/common/ListingGrid"

export function Interests() {
    const results = []
    for (let i = 0; i < 16; i++) {
        results.push(i)
    }
    return (
        <div>
            <section className="mx-20">
                <h1 className="h1 flex justify-center items-center">Contacted Properties</h1>
                <ListingGrid listings={results} />
            </section>
        </div>
    )
}