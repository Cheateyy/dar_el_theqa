import { useListings } from "../context/ListingsContext"

export function useWilayaOptions() {
    const { wilayas } = useListings()
    const wilayas_option = wilayas.map((wilaya) => ({ label: wilaya.name, value: wilaya.name }))
    return wilayas_option;
}
