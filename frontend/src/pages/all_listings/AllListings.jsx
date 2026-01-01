import { Combobox } from "@/components/common/Combobox";
import addSvg from "@/assets/icons/add.svg"
import { ListingGrid } from "@/components/common/ListingGrid";
import { useEffect, useState } from "react";
import { get_all_listings } from "../buyer/lib/api";
import { CARD_TYPE } from "../buyer/enum";

import { Header } from "@/components/common/Header";
import { AuthMessagingProvider } from "../buyer/context/AuthMessagingContext";


export default function AllListings() {
    /**@type {Statecontrol<Listing[]>} */
    const [listings, set_listings] = useState([])
    useEffect(() => {
        async function fetchData() {
            const response = await get_all_listings()
            set_listings(response)
        }
        fetchData()
    }, [])

    return (
        <AuthMessagingProvider>
            <Header />
            <div className="px-20">
                <section>
                    <h1 className="h1 text-center">All Listings</h1>
                    <div className="flex items-center justify-end mt-11">
                        <Combobox className="h-18" label="Status" options={[{ label: "All", value: "All" }]} />
                        <div className="p-4 bg-primary rounded-full ml-8">
                            <img src={addSvg} alt="add" />
                        </div>
                    </div>
                </section>
                <ListingGrid listings={listings} card_type={CARD_TYPE.ADMIN} />
            </div>
            <footer className="mt-20">
            </footer>
        </AuthMessagingProvider>
    )
}