import { useListings } from "../context/ListingsContext"

export function useWilayaOptions() {
    const { wilayas } = useListings()
    const wilayas_option = wilayas.map((wilaya) => ({ label: wilaya.name, value: wilaya.id }))
    return wilayas_option;
}

export function useRegionOptions() {
    const { regions } = useListings()
    const wilayas_option = regions.map((region) => ({ label: region.name, value: region.name }))
    return wilayas_option;
}
