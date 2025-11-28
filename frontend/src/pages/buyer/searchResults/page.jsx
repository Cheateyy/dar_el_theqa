import { Button } from "@/components/ui/button";
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

                        {/* SearchFilters: full width on small, positioned over hero on md+ */}
                        <SearchFilters className="w-full px-4 md:w-281 md:absolute md:top-[65%] md:left-1/2 md:-translate-x-1/2 mt-4 md:mt-0" />
                    </div>

                    <div className="flex justify-center items-center">
                        <Button className="mt-6 md:mt-10 w-full max-w-xs md:max-w-sm py-3 px-4">
                            Apply filters
                            <ArrowRight className="ml-3" />
                        </Button>
                    </div>
                </section>

                <section role="search results" className="mt-8 md:mt-12">
                    <ListingGrid listings={results} />
                </section>
            </main>
        </div>
    )
}
