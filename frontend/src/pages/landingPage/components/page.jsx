import logo from "@/assets/images/logo.png";
import heroImg from "../assets/landing_hero.png";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MainFilters from "./MainFilters";
import { ListingCard } from "@/components/common/ListingCard";
import { PartnerCard } from "./PartnerCard";
import { LoggedInBuyerActions, LoggedInSellerActions, NotLoggedInActions } from "./Actions";

export default function LandingPage() {
    return (
        <>
            <header>
                <div className="flex flex-row px-16 justify-between">
                    <div className="relative -left-10 top-4 max-w-52 max-h-52">
                        <img src={logo} alt="logo" />
                    </div>
                    {/* <LoggedInSellerActions /> */}
                    {/* <NotLoggedInActions /> */}
                    <LoggedInBuyerActions />
                </div>
            </header>

            <main className="px-20">
                <section role="hero">
                    <div className="relative">
                        <div
                            role="hero image and MainFilters"
                            style={{ backgroundImage: `url(${heroImg})` }}
                            className="bg-cover bg-center h-172 w-full rounded-4xl"
                        >
                            <div className="grid grid-cols-2 grid-rows-1 h-full justify-center items-center ml-20">
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
                        <MainFilters className="max-w-3/4 absolute top-3/4 left-1/2 -translate-x-1/2 " />
                    </div>
                </section>

                <section role="Search Listings" className="mt-10">
                    <div className="flex justify-center items-center">
                        <Button>
                            <span>Search Listings</span>
                            <ArrowRight />
                        </Button>
                    </div>
                </section>
                <section role="suggested listings" className="mt-21">
                    <div className="flex justify-center items-center">
                        <h2 className="h2">You might find interesting</h2>
                    </div>
                    <div className="mt-20 flex justify-around">
                        {[1, 2, 3, 4].map(() => <ListingCard />)}
                    </div>
                </section>
                <section className="partners mt-36">
                    <div className="flex justify-center items-center">
                        <h1 className="h1">Our Partners</h1>
                    </div>
                    <div role="partners grid" className="grid grid-cols-4 gap-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15]
                            .map(() => <PartnerCard />
                            )}

                    </div>
                    <div className="my-20 flex justify-center items-center">
                        <Button className="w-78 h-13">
                            <p >Become a partner</p>
                            <ArrowRight className="ml-3" />
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
}

