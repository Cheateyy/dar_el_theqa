import { FilterCombobox } from "../../components/FilterCombobox"
import { useState } from "react"

import { OFFER_TYPE } from "../../../buyer/types"
import { Combobox } from "@/components/common/Combobox"
import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"
import { RangeInput } from "../../components/RangeInput"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"

export function SearchFilters({ className }) {
    const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
    return (
        <SearchFiltersWrapper className={className} selectedOfferType={selectedOfferType} setSelectedOfferType={setSelectedOfferType}>
            <div className="flex overflow-auto min-h-32 relative gap-5 items-stretch">
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Wilaya" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Resgion" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Appartement" />
                <PriceInput offerType={selectedOfferType} />
            </div>
            <div className="mt-4 flex">
                <MoreFilters className={"ml-auto"} variant={'secondary'} />
            </div>
        </SearchFiltersWrapper>
    )
}

function PriceInput({ offerType }) {
    const rentOptions = [
        { label: "per month", value: "per month" },
        { label: "per year", value: "per year" },
    ]
    return (
        <div className="border shadow-xl rounded-2xl p-6">
            <RangeInput className={"border-none shadow-none p-0"} label="Price" unit={"DZD"} />
            {offerType == OFFER_TYPE.RENT &&
                <Combobox options={rentOptions} />
            }
        </div>
    )
}