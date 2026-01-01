import { Button } from "@/components/ui/button"

import switchOffIcon from '../assets/switchOff.svg'
import switchOnIcon from '../assets/switchOn.svg'
import starIcon from '../assets/star.svg'

import { RangeInput } from "../../components/RangeInput"
import { Label } from "@radix-ui/react-dropdown-menu"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearch } from "../context/searchContext"
/**@type {import('../../types/common')} */


/**
 * 
 * @param {Object} props
 */
export function MoreFilters({ className, }) {
    const { more_filters, set_more_filters } = useSearch()
    return (
        <div className={cn(className, "w-full p-10 shadow-xl rounded-xl outline bg-white relative")}>
            <h4 className="h4">More Filters</h4>
            <div role="switch">
                <button className="cursor-pointer"
                    onClick={() =>
                        set_more_filters((prev) =>
                            ({ ...prev, is_verified_only: more_filters.is_verified_only ? false : true }))}>
                    <img
                        src={more_filters.is_verified_only ? switchOnIcon : switchOffIcon}
                        alt="verifed doc switch" className="inline" />
                </button>
                <p className="ml-1 inline">Only show verified properties where all the documents are provided by the owner</p>
            </div>

            <div role="filters" className="flex flex-col gap-6 items-stretch">
                <div className="flex gap-5">
                    <RangeInput label="Area" unit={"m2"}
                        input_control={[more_filters.area_range, (new_range) => set_more_filters(prev => ({ ...prev, area_range: new_range }))]}
                    />
                    <FilterInput label={"floors"}
                        state_control={[more_filters.floors, (new_floors) => set_more_filters(prev => ({ ...prev, floors: new_floors }))]}
                    />
                    <FilterInput label={"Bedrooms"}
                        state_control={[more_filters.bedrooms, (new_bedrooms) => set_more_filters(prev => ({ ...prev, area_range: new_bedrooms }))]}
                    />
                    <FilterInput label={"Bathrooms"}
                        state_control={[more_filters.bathrooms, (new_bathrooms) => set_more_filters(prev => ({ ...prev, area_range: new_bathrooms }))]}
                    />
                </div>
                <div>
                    <FilterInput
                        state_control={[more_filters.rating, (new_rating) => set_more_filters(prev => ({ ...prev, rating: new_rating }))]}
                        className="w-full" label={"Ratings"} unit={<img src={starIcon} alt="start icon" />} />
                </div>
            </div>

            <div role="actions" className="flex mt-9">
                <Button variant={'ghost'} className={'text-red-500'}>Clear All</Button>
                <Button variant={'default'} className={'ml-auto'}>
                    Apply filters
                    <ArrowRight />
                </Button>
            </div>
        </div >
    )
}

/**
 * 
 * @param {Object} props
 * @param {StateControl<string>} props.state_control
 */
function FilterInput({ className, label, unit, state_control }) {
    const [value, set_value] = state_control
    return (
        <div className={cn("w-48 border shadox-xs rounded-2xl py-5 px-6 flex justify-start", className)}>
            <div className="flex flex-col justify-center">
                <Label>{label}</Label>
                <div className="flex">
                    <input
                        type="text" placeholder="Any" className="w-12"
                        value={value} onChange={(e) => set_value(e.target.value)}
                    />
                    {unit}
                </div>
            </div>
        </div>
    )
}