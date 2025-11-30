import { FilterCombobox } from "../../components/FilterCombobox"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { Button } from "@/components/ui/button"
import { useWilayaOptions } from "../../lib/hooks"
import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import filterIcon from '../assets/filter.svg'
import { RangeInput } from "../../components/RangeInput"
import { OFFER_TYPE } from "../../enum"

/**
 * @param {Object} props
 * @param {StateControl<SearchFilters>} props.state_control
 * @param {StateControl<string>} props.property_type_control
 * @param {StateControl<boolean>} props.dialog_control
 */
export function MainSearchFilters({ className, state_control, dialog_control, property_type_control }) {
    const [filters, set_filters] = state_control
    const [selected_property_type, set_selected_property_type] = property_type_control
    const wilaya_options = useWilayaOptions()
    const [_, set_search_params] = useSearchParams()
    const [is_dlg_open, set_is_dlg_open] = dialog_control

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
                {!is_dlg_open && <div className="mt-20 flex">
                    <Button variant={'secondary'} className={"ml-auto"} onClick={() => set_is_dlg_open(true)}>
                        <img src={filterIcon} alt="" />
                        More filters
                    </Button>
                </div>}
            </SearchFiltersWrapper>

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