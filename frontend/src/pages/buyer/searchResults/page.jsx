import heroImg from "./assets/hero.jpg"
import { SearchFilters } from "./components/SearchFilters";
import { ListingGrid } from "../../../components/common/ListingGrid";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { search as get_search_listings } from "../lib/api";

/**@type {import('@/types/common')} */
/**
 * @typedef SearchResult
 * @property {number} count
 * @property {Listing[]} listings
 * 
 */
export default function SearchResults() {
    const [search_params, set_search_params] = useSearchParams()

    /**@type {StateControl<Listing[]>} */
    const [listings, set_listings] = useState([])
    useEffect(() => {
        async function fetchData() {
            const search_params_obj = Object.fromEntries(search_params.entries())
            /**@type {SearchResult} */
            const search_result = await get_search_listings(search_params_obj)
            set_listings(search_result.listings)
        }
        fetchData()
    },
        [search_params])

    return (
        <div>
            <main className="px-4 sm:px-8 md:px-20 max-w-7xl mx-auto">
                <section role="hero">
                    <div className="relative">
                        <div
                            role="hero image and MainFilters"
                            style={{ backgroundImage: `url(${heroImg})` }}
                            className="bg-cover bg-center w-full rounded-4xl h-56 sm:h-80 md:h-172"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
                                <div role="hero-text-wrapper" className="px-6 md:pl-20">
                                    <h1 className="h1 text-white mb-2 text-center md:text-left">
                                        Explore Trusted Properties
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <SearchFilters
                            className="w-full px-4 md:w-281 md:absolute md:top-[65%] md:left-1/2 md:-translate-x-1/2 mt-4 md:mt-0"
                        />
                    </div>


                </section>
                {/* TODO: fix top margin */}
                <section role="search results" className="mt-8 md:mt-12 lg:mt-100">
                    <ListingGrid listings={listings} />
                </section>
            </main>
        </div>
    )
}
