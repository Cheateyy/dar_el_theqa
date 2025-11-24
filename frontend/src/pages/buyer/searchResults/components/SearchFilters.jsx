import { FilterCombobox } from "../../components/FilterCombobox"
import { useState } from "react"

import { OFFER_TYPE } from "../../../buyer/types"
import { Combobox } from "@/components/common/Combobox"
import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"
import { RangeInput } from "../../components/RangeInput"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { Button } from "@/components/ui/button"


export function SearchFilters({ className }) {
    const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
    const [isDlgOpen, setIsDlgOpen] = useState(false)

    return (
        <SearchFiltersWrapper className={className} selectedOfferType={selectedOfferType} setSelectedOfferType={setSelectedOfferType}>
            <div className="flex overflow-auto relative gap-5">
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Wilaya" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Resgion" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Appartement" />
                <PriceInput offerType={selectedOfferType} />
            </div>
            <div className="mt-20 flex">
                <Button variant={'secondary'} className={className} onClick={() => setIsDlgOpen(true)}>
                    {/* <img src={filterIcon} alt="" /> */}
                    More filters
                </Button>
                <MoreFilters className={"ml-auto"} variant={'secondary'} isOpen={isDlgOpen} setIsOpen={setIsDlgOpen} />
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
        <div className="border shadow-xl rounded-2xl p-6 h-32">
            <RangeInput className={"border-none shadow-none p-0"} label="Price" unit={"DZD"} />
            {offerType == OFFER_TYPE.RENT &&
                <Combobox options={rentOptions} />
            }
        </div>
    )
}