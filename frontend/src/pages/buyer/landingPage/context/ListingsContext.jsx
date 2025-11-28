import { api } from "@/lib/api_client";
import { createContext, useContext, useEffect, useState } from "react";

/** @typedef {import("../models/ListingModel")}*/

/** @type {React.Context<{ listings: Listing[], setListings: import('react').Dispatch<import('react').SetStateAction<Listing[]>> }>} */
const ListingsContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function ListingProvider({ children }) {
    /** @type {[Listing[], import('react').Dispatch<import('react').SetStateAction<Listing[]>>]} */
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            const res = await api.get("/api/listings/featured");
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }
            const data = await res.json();
            console.log("Listings fetch in the provider", data);
            setListings(data);
        };
        fetchListings();
    }, []);

    return (
        <ListingsContext.Provider value={{ listings, setListings }}>
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
