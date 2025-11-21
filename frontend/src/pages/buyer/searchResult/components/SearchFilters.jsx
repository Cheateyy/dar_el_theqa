import { FilterCombobox } from "../../components/FilterCombobox"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"

import { cn } from "@/lib/utils"
import filterIcon from '../assets/filter.svg'
import { OfferType as OFFER_TYPE } from "../../types"
import arrowDownIcon from '../../../buyer/assets/arrowDown.svg'
import { Combobox } from "@/components/common/Combobox"

export function SearchFilters({ className }) {
    const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
    return (
        <div className={cn("relative w-full min-h-49 p-10 shadow-xl rounded-xl outline z-0 bg-white", className)}>
            <div className="flex overflow-auto min-h-32 relative gap-5 items-stretch">
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Wilaya" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Resgion" />
                <FilterCombobox className={'w-48 rounded-2xl'} options={[]} filtername="Appartement" />
                <PriceInput offerType={selectedOfferType} />
            </div>
            <div className="mt-4 flex">
                <Button className="ml-auto" variant={'secondary'}>
                    <img src={filterIcon} alt="" />
                    More filters
                </Button>
            </div>
            {/* absolute positioned*/}
            <ButtonGroup className={'absolute right-0 -top-5 w-104 -z-10'}>
                <Button
                    variant={selectedOfferType == OFFER_TYPE.RENT ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}
                    onClick={() => setSelectedOfferType(OFFER_TYPE.RENT)}
                >
                    Rent
                </Button>
                <Button
                    variant={selectedOfferType == OFFER_TYPE.BUY ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}
                    onClick={() => setSelectedOfferType(OFFER_TYPE.BUY)}
                >
                    Buy
                </Button>
            </ButtonGroup>
        </div>
    )
}

function PriceInput({ offerType }) {
    const rentOptions = [
        { label: "per month", value: "per month" },
        { label: "per year", value: "per year" },
    ]
    return (
        <div className="w-104 min-h-32 border shadow-xs p-6 rounded-2xl flex flex-col gap-3">
            <p className="font-medium">Price</p>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    pattern="[0-9]*"
                    className="min-w-10 px-2 py-1 text-sm"
                    placeholder="0"
                />

                <span>-</span>

                <input
                    type="text"
                    pattern="[0-9]*"
                    className="min-w-10 px-2 py-1 text-sm"
                    placeholder="1000"
                />

                <span className="text-sm font-bold">DZD</span>
            </div>

            {offerType == OFFER_TYPE.RENT &&
                <Combobox options={rentOptions} />
            }
        </div>
    )
}