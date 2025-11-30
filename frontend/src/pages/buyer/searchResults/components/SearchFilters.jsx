import { useEffect, useState } from "react"

import { OFFER_TYPE } from "../../enum"
import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"

import closeSvg from '../assets/close.svg'
import ReactModal from "react-modal"
import { MainSearchFilters } from "./MainSearchFilters"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useSearchParams } from "react-router-dom"

ReactModal.setAppElement('#root'); // Or whatever your main app container ID is

/**@type {import('@/types/common')} */
/**@type {import('../../types/common')} */


/**
 * @typedef SearchPayload
 * @property {"BUY" | "RENT"} transaction_type
 * @property {int} wilaya_id
 * @property {int} region_id
 * @property {string} property_type
 * @property {double} price_min
 * @property {double} price_max
 * @property {double | null} rent_time_unit
 * @property {boolean} is_verified_only
 * @property {int} area_min
 * @property {int} area_max
 * @property {int} floors
 * @property {int} bedrooms 
 * @property {int} bathrooms
 * @property {int} page
 */

export function SearchFilters({ className }) {
    const [is_dialog_open, set_is_dialog_open] = useState(false)
    const [selected_property_type, set_selected_offer_type] = useState(OFFER_TYPE.BUY)
    const [search_params, set_search_params] = useSearchParams()

    /**@type {InputControl<SearchFilters>} */
    const [filters, set_filters] = useState({
        wilaya: search_params.get("wilaya"),
        type: search_params.get("type"),
        property_type: search_params.get("property_type"),
        price_range: search_params.get("price_range") ?? [-Infinity, Infinity],
    })
    /**@type {StateControl<MoreFilters>} */
    const [more_filters, set_more_filters] = useState({
        area_range: search_params.get("area_range") ?? [-Infinity, Infinity],
        floors: search_params.get("floors"),
        bedrooms: search_params.get("bedrooms"),
        bathrooms: search_params.get("bathrooms"),
        rating: search_params.get("rating"),
    })

    // We are updating searchParams each time filter_input_values got changed
    // TODO: think of merging search_params and filter_input_values into one state (maybe using context)

    // ==== Search state mng ======

    /**
        * @returns {SearchPayload}
        */
    function get_search_obj() {
        return {
            transaction_type: selected_property_type,
            wilaya_id: filters.wilaya,
            region_id: filters.region,
            property_type: filters.property_type,
            price_min: filters.price_range[0],
            price_max: filters.price_range[1],
            // more filters
            floors: more_filters.floors,
            bedrooms: more_filters.bedrooms,
            bathrooms: more_filters.bathrooms,

            // not included in filters
            // TODO: controll this inputs
            rent_time_unit: null,
            is_verified_only: false,
            page: null,
        }
    }

    useEffect(() => {
        set_search_params(new URLSearchParams(get_search_obj()))
    }, [filters, more_filters])

    return (
        <div>
            <div role="static-filters" className={className}>
                <MainSearchFilters
                    dialog_control={[is_dialog_open, set_is_dialog_open]}
                    state_control={[filters, set_filters]}
                    property_type_control={[selected_property_type, set_selected_offer_type]} />
                <ApplyFiltersButton />
            </div>

            <ReactModal
                isOpen={is_dialog_open}
                onRequestClose={() => set_is_dialog_open(false)}
                className="
                    fixed left-1/2 top-1/2 
                    transform -translate-x-1/2 -translate-y-1/2 

                    w-[95vw] max-w-lg 
                    md:max-w-3xl 
                    lg:max-w-4xl 

                    max-h-[90vh] overflow-y-auto
                  rounded-xl shadow-xl p-4
                    z-50
                "
                ariaHideApp={false}
                style={{
                    overlay: {
                        zIndex: 10,
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',   // darken overlay
                        backdropFilter: 'blur(8px)',            // apply blur
                        WebkitBackdropFilter: 'blur(8px)',      // Safari support
                    },
                }}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
            >

                <div role="close dialog" className="flex">
                    <button className="mr-auto p-4 bg-white rounded-full cursor-pointer"
                        onClick={() => set_is_dialog_open(false)}
                    >
                        <img src={closeSvg} alt="close" />
                    </button>
                </div>

                <MainSearchFilters
                    dialog_control={[is_dialog_open, set_is_dialog_open]}
                    state_control={[filters, set_filters]}
                    property_type_control={[selected_property_type, set_selected_offer_type]}
                />

                <MoreFilters className={"mt-8 p-10 rounded-2xl bg-white"} state_control={[more_filters, set_more_filters]} />
            </ReactModal>
        </div>
    )
}

function ApplyFiltersButton() {
    return (
        <div className="flex justify-center items-center">
            <Button className="mt-6 md:mt-10 w-full max-w-xs md:max-w-sm py-3 px-4">
                Apply filters
                <ArrowRight className="ml-3" />
            </Button>
        </div>
    )
}

