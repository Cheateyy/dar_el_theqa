import { api } from "@/lib/api_client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetch_listings } from "../../lib/api";

/** @typedef {import("@/models/ListingModel")}*/

/** @type {React.Context<{ listings: Listing[], setListings: import('react').Dispatch<import('react').SetStateAction<Listing[]>> }>} */
const ListingsContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function ListingProvider({ children }) {
    /** @type {[Listing[], import('react').Dispatch<import('react').SetStateAction<Listing[]>>]} */
    const [listings, set_listings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            set_listings(await fetch_listings());
        };
        fetchData();
    }, []);

    return (
        <ListingsContext.Provider value={{ listings, setListings: set_listings }}>
            {children}
        </ListingsContext.Provider>
    );
}

/**
 * @returns {{ listings: Listing[], setListings: import('react').Dispatch<import('react').SetStateAction<Listing[]>> }}
 */
export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error("useListings must be used within a ListingProvider");
    }
    return context;
};
