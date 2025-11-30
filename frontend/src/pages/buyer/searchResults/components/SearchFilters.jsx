import { FilterCombobox } from "../../components/FilterCombobox"
import { useEffect, useState } from "react"

import { OFFER_TYPE } from "../../../buyer/types"
import { Combobox } from "@/components/common/Combobox"
import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"
import { RangeInput } from "../../components/RangeInput"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useWilayaOptions } from "../../lib/hooks"

/**@type {import('@/types/common')} */

/**
 * @typedef SearchFilters
 * @property {string} wilaya
 * @property {string} region
 * @property {string} appartement
 * @property {[string, string]} price_range
 */

/**
 * 
 * @param {Object} props
 * @param {StateControl<URLSearchParams>} props.search_control
 */
export function SearchFilters({ className, search_control }) {
    const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
    const [isDlgOpen, setIsDlgOpen] = useState(false)
    /**@type {InputControl<SearchFilters>} */
    const [filter_input_values, set_filter_input_values] = useState({ wilaya: null, type: null, appartement: null, price_range: [-Infinity, Infinity] })

    const wilaya_options = useWilayaOptions()

    // We are updating searchParams each time filter_input_values got changed
    // TODO: think of merging search_params and filter_input_values into one state (maybe using context)
    const [search_params, set_search_params] = search_control
    useEffect(() => {
        set_search_params(new URLSearchParams(filter_input_values))
    }, [filter_input_values])

    return (
        <SearchFiltersWrapper className={className} selectedOfferType={selectedOfferType} setSelectedOfferType={setSelectedOfferType}>
            <div className="flex overflow-auto relative gap-5">
                <FilterCombobox
                    filtername="Wilaya"
                    input_control={
                        [filter_input_values.wilaya,
                        (new_wilaya) => set_filter_input_values(prev => ({ ...prev, wilaya: new_wilaya }))]}

                    className={'w-48 rounded-2xl'}
                    options={wilaya_options}
                />
                <FilterCombobox
                    filtername="Region"
                    input_control={
                        [filter_input_values.wilaya,
                        (new_region) => set_filter_input_values(prev => ({ ...prev, region: new_region }))]}
                    className={'w-48 rounded-2xl'}
                    options={[]}
                />
                <FilterCombobox
                    filtername="Appartement"
                    input_control={
                        [filter_input_values.wilaya,
                        (new_appartement) => set_filter_input_values(prev => ({ ...prev, appartement: new_appartement }))]}
                    className={'w-48 rounded-2xl'}
                    options={[]}
                />
                <PriceInput
                    offerType={selectedOfferType}
                    input_control={[filter_input_values.price_range, (new_range) => set_filter_input_values(prev => ({ ...prev, price_range: new_range }))]}
                />
            </div>
            <div className="mt-20 flex">
                <Button variant={'secondary'} className={className} onClick={() => setIsDlgOpen(true)}>
                    {/* <img src={filterIcon} alt="" /> */}
                    More filters
                </Button>
                <MoreFilters className={"ml-auto"} variant={'secondary'} isOpen={isDlgOpen} setIsOpen={setIsDlgOpen} />
            </div>

            <div className="flex justify-center items-center">
                <Button className="mt-6 md:mt-10 w-full max-w-xs md:max-w-sm py-3 px-4">
                    Apply filters
                    <ArrowRight className="ml-3" />
                </Button>
            </div>
        </SearchFiltersWrapper>
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