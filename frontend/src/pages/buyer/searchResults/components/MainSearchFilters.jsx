import { FilterCombobox } from "../../components/FilterCombobox"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { Button } from "@/components/ui/button"
import { useRegionOptions, useWilayaOptions } from "../../lib/hooks"
import filterIcon from '../assets/filter.svg'
import { RangeInput } from "../../components/RangeInput"
import { OFFER_TYPE } from "../../enum"
import { Combobox } from "@/components/common/Combobox"

/**@type {import("../../types/common")} */

/**
 * @param {Object} props
 * @param {StateControl<SearchFilters>} props.state_control
 * @param {StateControl<string>} props.property_type_control
 * @param {StateControl<boolean>} props.dialog_control
 */
export function MainSearchFilters({ className, state_control, dialog_control, property_type_control }) {
    const [filters, set_filters] = state_control
    const [selected_property_type, set_selected_property_type] = property_type_control
    const [is_dlg_open, set_is_dlg_open] = dialog_control

    const wilaya_options = useWilayaOptions()
    const regions = useRegionOptions()

    return (
        <div>
            <SearchFiltersWrapper className={className} selectedOfferType={selected_property_type} setSelectedOfferType={set_selected_property_type}>
                <div className="flex flex-col items-center sm:flex-col md:flex-row overflow-auto relative gap-5">
                    <FilterCombobox
                        filtername="Wilaya"
                        input_control={
                            [filters.wilaya_id,
                            (new_wilaya_id) => set_filters(prev => ({ ...prev, wilaya_id: new_wilaya_id }))]}
                        className={'rounded-2xl'}
                        options={wilaya_options}
                    />
                    <FilterCombobox
                        filtername="Region"
                        input_control={
                            [filters.region,
                            (new_region) => set_filters(prev => ({ ...prev, region: new_region }))]}
                        className={'w-48 rounded-2xl'}
                        options={regions}
                    />
                    <FilterCombobox
                        filtername="Appartement"
                        input_control={
                            [filters.property_type,
                            (new_appartement) => set_filters(prev => ({ ...prev, property_type: new_appartement }))]}
                        className={'w-48 rounded-2xl'}
                        options={[{ label: "APARTMENT", value: "APARTMENT" }]}
                    />

                    <PriceInput
                        offerType={selected_property_type}
                        input_control={[filters.price_range, (new_range) => set_filters(prev => ({ ...prev, price_range: new_range }))]}
                        rent_unit_control={[filters.rent_time_unit, (new_rent_unit) => set_filters(prev => ({ ...prev, rent_time_unit: new_rent_unit }))]}
                    />
                </div>
                {/*render more filters button iff dialog is not opened */}
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
 * @param {InputControl<string> } props.rent_unit_control
 */
function PriceInput({ offerType, input_control, rent_unit_control }) {
    const rent_unit_options = [
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
                <Combobox options={rent_unit_options} state_control={rent_unit_control} />
            }
        </div>
    )
}