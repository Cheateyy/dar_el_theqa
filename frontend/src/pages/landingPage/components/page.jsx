import logo from "@/assets/images/logo.png";
import heroImg from "../assets/landing_hero.png";

import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";
import MainFilters from "./MainFilters";

export default function LandingPage() {
    return (
        <>
            <header>
                <div className="flex flex-row px-16 justify-between">
                    <div className="relative -left-10 top-4 max-w-52 max-h-52">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="flex flex-row items-center">
                        <Button className="w-28 h-12 mr-3 text-gray-600" variant="ghost">
                            <GlobeIcon />
                            Language
                        </Button>
                        <Button className="w-38 h-12 p-3">Log In</Button>
                    </div>
                </div>
            </header>

            <main>
                <section className="px-20">
                    <div
                        style={{ backgroundImage: `url(${heroImg})` }}
                        className="bg-cover bg-center h-172 w-full rounded-4xl"
                    >
                        <div className="grid grid-cols-2 grid-rows-1 h-full justify-center items-center ml-20">
                            <div>
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
                    <MainFilters />

                </section>

                <div>
                    Lorem ipsum...
                </div>
            </main>
        </>
    );
}

