import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OFFER_TYPE } from "../../enum";


// sentinel numbers
const MIN_PRICE = 0
const MAX_PRICE = 1_000_000_000

const MIN_AREA = 0
const MAX_AREA = 1_000_000_000


/**
 * @typedef {Object} SearchStore
 * @property {SearchFilters} filters
 * @property {import('react').Dispatch<import('react').SetStateAction<SearchFilters>>} set_filters
 
 * @property {MoreFilters} more_filters
 * @property {import('react').Dispatch<import('react').SetStateAction<MoreFilters>>} set_more_filters
  
 * @property {string} selected_property_type
 * @property {import('react').Dispatch<import('react').SetStateAction<string>>} set_selected_property_type
 
 * @property {number} page
 * @property {import('react').Dispatch<import('react').SetStateAction<number>>} set_page
set_page
 */


/** @type {React.Context<SearchStore>} */
const SearchContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function SearchProvider({ children }) {
    const [search_params, set_search_params] = useSearchParams()

    const [selected_offer_type, set_selected_offer_type] = useState(OFFER_TYPE.BUY)

    const [page, set_page] = useState(1)

    /**@type {InputControl<SearchFilters>} */
    const [filters, set_filters] = useState({
        wilaya_id: search_params.get("wilaya_id"),
        type: search_params.get("type"),
        property_type: search_params.get("property_type"),
        price_range: search_params.get("price_range") ?? [MIN_PRICE, MAX_PRICE],
    })
    /**@type {StateControl<MoreFilters>} */
    const [more_filters, set_more_filters] = useState({
        is_verified_only: search_params.get("is_verified_only"),
        area_range: search_params.get("area_range") ?? [MIN_AREA, MAX_AREA],
        floors: search_params.get("floors"),
        bedrooms: search_params.get("bedrooms"),
        bathrooms: search_params.get("bathrooms"),
        rating: search_params.get("rating"),
    })

    // We are updating searchParams each time filter_input_values got changed
    // TODO: think of merging search_params and filter_input_values into one state (maybe using context)

    // ==== Search state mng ======
    useEffect(() => {
        const params_obj = get_search_params_obj()
        set_search_params(new URLSearchParams(params_obj))
    }, [filters, selected_offer_type, more_filters, page])

    /**
            * @returns {SearchPayload}
            */
    function get_search_params_obj() {
        return Object.fromEntries(
            Object.entries({
                transaction_type: selected_offer_type,
                wilaya_id: filters.wilaya_id,
                region_id: filters.region_id,
                property_type: filters.property_type,
                price_min: filters.price_range?.[0],
                price_max: filters.price_range?.[1],
                rent_time_unit: filters.rent_time_unit,

                is_verified_only: more_filters.is_verified_only,
                floors: more_filters.floors,
                bedrooms: more_filters.bedrooms,
                bathrooms: more_filters.bathrooms,

                page,
            }).filter(([, v]) => v !== undefined && v !== null)
        )
    }

    return (
        <SearchContext.Provider value={{
            filters, set_filters,
            more_filters, set_more_filters,
            selected_offer_type, set_selected_offer_type,
            page, set_page,
        }}>
            {children}
        </SearchContext.Provider>
    );
}

/**
 * @returns {SearchStore}
 */
export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
