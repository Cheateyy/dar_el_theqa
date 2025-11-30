import { FilterCombobox } from "../../components/FilterCombobox"
import { useEffect, useState } from "react"

import { OFFER_TYPE } from "../../enum"
import { Combobox } from "@/components/common/Combobox"
import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"
import { RangeInput } from "../../components/RangeInput"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useWilayaOptions } from "../../lib/hooks"
import { useSearchParams } from "react-router-dom"

import ReactModal from "react-modal"
ReactModal.setAppElement('#root'); // Or whatever your main app container ID is

import filterIcon from '../assets/filter.svg'

/**@type {import('@/types/common')} */
/**@type {import('../../types/common')} */

/**
 * 
 * @typedef SearchFilters
 * @property {string} wilaya
 * @property {string} region
 * @property {string} appartement
 * @property {[string, string]} price_range
 */

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
    const [isDlgOpen, setIsDlgOpen] = useState(false)

    const [selected_property_type, set_selected_offer_type] = useState(OFFER_TYPE.BUY)

    /**@type {InputControl<SearchFilters>} */
    const [filters, set_filters] = useState({ wilaya: null, type: null, appartement: null, price_range: [-Infinity, Infinity], })
    /**@type {StateControl<MoreFilters>} */
    const [more_filters, set_more_filters] = useState({ area_range: [-Infinity, Infinity], floors: null, bedrooms: null, bathrooms: null, rating: null, })

    return (
        <div>
            <ReactModal
                isOpen={isDlgOpen}
                onRequestClose={() => setIsDlgOpen(false)}
                className="z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto"
                // overlayClassName="fixed inset-0 flex items-center justify-center p-4"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
            >
                <SearchFiltersTmp
                    setIsDlgOpen={setIsDlgOpen}
                    state_control={[filters, set_filters]}
                    property_type_control={[selected_property_type, set_selected_offer_type]} />
                <MoreFilters className={"mt-20"} state_control={[more_filters, set_more_filters]} />
            </ReactModal>

            <div className={className}>
                <SearchFiltersTmp
                    setIsDlgOpen={setIsDlgOpen}
                    state_control={[filters, set_filters]}
                    property_type_control={[selected_property_type, set_selected_offer_type]} />
                <ApplyFiltersButton />
            </div>
        </div>
    )
}

/**
 * @param {Object} props
 * @param {StateControl<SearchFilters>} props.state_control
 * @param {StateControl<string>} props.property_type_control
 */
function SearchFiltersTmp({ className, state_control, setIsDlgOpen, property_type_control }) {
    const [filters, set_filters] = state_control
    const [selected_property_type, set_selected_property_type] = property_type_control
    const wilaya_options = useWilayaOptions()
    const [_, set_search_params] = useSearchParams()

    // ==== Search state mng ======
    /**
    * @param {SearchFilters} search_filters 
    * @returns {SearchPayload}
    */
    // function get_search_payload(search_filters) {
    //     return {
    //         transaction_type: selectedPropertyType,
    //         wilaya_id: filters.wilaya,
    //         region_id: filters.region,
    //         property_type: selectedPropertyType,

    //         // not included in filters
    //         is_verified_only: false,
    //     }
    // }
    // We are updating searchParams each time filter_input_values got changed
    // TODO: think of merging search_params and filter_input_values into one state (maybe using context)
    useEffect(() => {
        set_search_params(new URLSearchParams(filters))
    }, [filters])

    return (
        <div>
            <SearchFiltersWrapper className={className} selectedOfferType={selected_property_type} setSelectedOfferType={set_selected_property_type}>
                <div className="flex overflow-auto relative gap-5">
                    <FilterCombobox
                        filtername="Wilaya"
                        input_control={
                            [filters.wilaya,
                            (new_wilaya) => set_filters(prev => ({ ...prev, wilaya: new_wilaya }))]}
                        className={'w-48 rounded-2xl'}
                        options={wilaya_options}
                    />
                    <FilterCombobox
                        filtername="Region"
                        input_control={
                            [filters.wilaya,
                            (new_region) => set_filters(prev => ({ ...prev, region: new_region }))]}
                        className={'w-48 rounded-2xl'}
                        options={[]}
                    />
                    <FilterCombobox
                        filtername="Appartement"
                        input_control={
                            [filters.wilaya,
                            (new_appartement) => set_filters(prev => ({ ...prev, appartement: new_appartement }))]}
                        className={'w-48 rounded-2xl'}
                        options={[]}
                    />
                    <PriceInput
                        offerType={selected_property_type}
                        input_control={[filters.price_range, (new_range) => set_filters(prev => ({ ...prev, price_range: new_range }))]}
                    />
                </div>
                <div className="mt-20 flex">
                    <Button variant={'secondary'} className={"ml-auto"} onClick={() => setIsDlgOpen(true)}>
                        <img src={filterIcon} alt="" />
                        More filters
                    </Button>
                </div>
            </SearchFiltersWrapper>

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

/**
 * @param {Object} props
 * @param {InputControl<[string, string]> } props.input_control
 */
function PriceInput({ offerType, input_control }) {
    const rentOptions = [
        { label: "per month", value: "per month" },
        { label: "per year", value: "per year" },
    ]
    return (
        <div className="border shadow-xl rounded-2xl p-6 h-32">
            <RangeInput
                input_control={input_control}
                className={"border-none shadow-none p-0"} label="Price" unit={"DZD"}
            />
            {offerType == OFFER_TYPE.RENT &&
                <Combobox options={rentOptions} />
            }
        </div>
    )
}