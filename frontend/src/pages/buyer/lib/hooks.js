import { useListings } from "../context/ListingsContext"
import { useSearch } from "../searchResults/context/searchContext";

export function useWilayaOptions() {
    const { wilayas } = useListings()
    const wilayas_option = wilayas.map((wilaya) => ({ label: wilaya.name, value: wilaya.id }))
    return wilayas_option;
}

export function useRegionOptions() {
    const { regions } = useSearch()
    const region_options = regions.map((region) => ({ label: region.name, value: region.name }))
    return region_options;
}
