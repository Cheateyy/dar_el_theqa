import { createContext, useContext, useEffect, useState } from "react";
import { get_listings, get_property_types, get_wilayas } from "../lib/api";

/** @typedef {import("@/types/ListingModel")}*/
/** @typedef {import("@/types/common")}*/

/**
 * @typedef {Object} ListingsStore
 * @property {Listing[]} listings
 * @property {import('react').Dispatch<import('react').SetStateAction<Listing[]>>} set_listings
 * 
 * @property {Option[]} property_types
 * @property {import('react').Dispatch<import('react').SetStateAction<Option[]>>} set_property_types
 * 
 * @property {Wilaya[]} wilayas
 * @property {import('react').Dispatch<import('react').SetStateAction<Wilaya[]>>} set_wilayas
 */

/** @type {React.Context<ListingsStore>} */
const ListingsContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function ListingProvider({ children }) {
    /** @type {[Listing[], import('react').Dispatch<import('react').SetStateAction<Listing[]>>]} */
    const [listings, set_listings] = useState([]);

    /** @type {[Option[], import('react').Dispatch<import('react').SetStateAction<Option[]>>]} */
    const [property_types, set_property_types] = useState([]);

    /** @type {[Wilaya[], import('react').Dispatch<import('react').SetStateAction<Wilaya[]>>]} */
    const [wilayas, set_wilayas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            set_listings(await get_listings());
            set_property_types(await get_property_types())
            set_wilayas(await get_wilayas())
        };
        fetchData();
    }, []);

    return (
        <ListingsContext.Provider value={{
            listings, set_listings,
            property_types, set_property_types,
            wilayas, set_wilayas,
        }}>
            {children}
        </ListingsContext.Provider>
    );
}

/**
 * @returns {ListingsStore}
 */
export const useListings = () => {
    const context = useContext(ListingsContext);
    if (!context) {
        throw new Error("useListings must be used within a ListingProvider");
    }
    return context;
};
