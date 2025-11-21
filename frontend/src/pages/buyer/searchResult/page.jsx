import { Button } from "@/components/ui/button";
import { BuyerHeader } from "../../buyer/components/Header"
import heroImg from "./assets/hero.jpg"
import { SearchFilters } from "./components/SearchFilters";
import { ArrowRight } from "lucide-react";
import { ListingGrid } from "../../../components/common/ListingGrid";

export default function SearchResults() {
    const results = []
    for (let i = 0; i < 16; i++) {
        results.push(i)
    }

    return (
        <div>
            <main className="px-20">
                <section role="hero">
                    <div className="relative">
                        <div
                            role="hero image and MainFilters"
                            style={{ backgroundImage: `url(${heroImg})` }}
                            className="bg-cover bg-center h-172 w-full rounded-4xl"
                        >
                            <div className="grid grid-rows-2 h-full justify-center items-center ml-20">
                                <div role="hero-text-wrapper">
                                    <h1 className="h1 text-white">Explore Trusted Properties</h1>
                                </div>
                            </div>
                        </div>
                        <SearchFilters className="w-281 absolute top-3/4 left-1/2 -translate-x-1/2" />
                    </div>
                    <div className="flex justify-center items-center">
                        <Button className="mt-30 w-54 py-4 px-8">
                            Apply filters
                            <ArrowRight className="ml-3" />
                        </Button>
                    </div>
                </section>
                <section role="search results">
                    <ListingGrid listings={results} />
                </section>
            </main>
        </div>
    )
}
