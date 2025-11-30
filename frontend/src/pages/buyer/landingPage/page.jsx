import heroImg from "./assets/landing_hero.png";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MainSearchFilters from "./components/MainSearchFilters";
import { PartnerCard } from "./components/PartnerCard";
import { ListingGrid } from "@/components/common/ListingGrid";
import { useListings } from "../context/ListingsContext";
import { useEffect, useState } from "react";
import { get_partners } from "../lib/api";

/**@type {import('@/types/PartnerModel')} */
/**@type {import('@/types/common')} */

export default function LandingPage() {
    const { listings } = useListings()
    /**@type {StateControl<Partner[]>} */
    const [partners, set_partners] = useState([])
    useEffect(() => {
        async function fetch_data() {
            set_partners(await get_partners())
        }
        fetch_data()
    }, [])

    return (
        <>
            <main className="px-4 sm:px-8">
                <section role="hero">
                    <div className="relative">
                        <div
                            role="hero image and MainFilters"
                            style={{ backgroundImage: `url(${heroImg})` }}
                            className="w-full h-[420px] sm:h-[520px] md:h-172 bg-cover bg-center rounded-4xl"
                        >
                            <div className="h-full grid grid-cols-2 grid-rows-1 justify-center items-center ml-4 sm:ml-8 md:ml-20">
                                <div role="hero-text-wrapper">
                                    <h1 className="h1 text-primary mb-4">
                                        Real Estate
                                    </h1>
                                    <h1 className="h1 text-primary mb-4">
                                        You Can
                                    </h1>
                                    <h1 className="h1 text-primary mb-2">
                                        Trust
                                    </h1>
                                    <p className="p3">
                                        Connecting you with trusted sellers and agents
                                    </p>
                                </div>
                            </div>
                        </div>
                        <MainSearchFilters className="w-3/4 relative top-1/2 left-1/2 -translate-x-1/2 " />
                    </div>
                </section>

                <section role="suggested listings" className="mt-8 sm:mt-16 md:mt-20">
                    <div className="flex justify-center items-center">
                        <h2 className="h2">You might find interesting</h2>
                    </div>
                    <div className="mt-3">
                        <div className="flex">
                            <Button variant="ghost" className={'ml-auto'}>
                                View more
                                <ArrowRight />
                            </Button>
                        </div>
                        <ListingGrid listings={listings} />
                    </div>
                </section>
                <section className="partners mt-12 sm:mt-24 md:mt-36">
                    <div className="flex justify-center items-center">
                        <h1 className="h1">Our Partners</h1>
                    </div>

                    <div role="partners grid" className="mt-10 sm:mt-15 md:mt-25 grid grid-cols-2 md:grid-cols-4 gap-10">
                        {partners
                            .map((partner) => <PartnerCard key={partner.id} partner={partner} />
                            )}

                    </div>
                    <div className="my-20 flex justify-center items-center">
                        <Button>
                            <p >Become a partner</p>
                            <ArrowRight className="ml-3" />
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
}

