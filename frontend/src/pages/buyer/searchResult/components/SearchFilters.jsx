import { FilterCombobox } from "../../components/FilterCombobox"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"

import { cn } from "@/lib/utils"
import filterIcon from '../assets/filter.svg'

export function SearchFilters({ className }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
        <div className={cn("relative w-full min-h-49 p-10 shadow-xl rounded-xl outline z-0 bg-white", className)}>
            <div className="flex overflow-auto relative gap-5">
                <FilterCombobox className={'w-48 h-32 rounded-2xl'} options={[]} filtername="Wilaya" />
                <FilterCombobox className={'w-48 h-32 rounded-2xl'} options={[]} filtername="Resgion" />
                <FilterCombobox className={'w-48 h-32 rounded-2xl'} options={[]} filtername="Appartement" />
                <PriceInput />
            </div>
            <div className="mt-4 flex">
                <Button className="ml-auto" variant={'secondary'}>
                    <img src={filterIcon} alt="" />
                    More filters
                </Button>
            </div>
            {/* absolute positioned*/}
            <ButtonGroup className={'absolute right-0 -top-5 w-104 -z-10'}>
                <Button variant={selectedIndex == 0 ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}>Rent</Button>
                <Button variant={selectedIndex == 1 ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}>Buy</Button>
            </ButtonGroup>
        </div>
    )
}

function PriceInput() {
    return (
        <div className="w-104 h-32 border shadow-xs p-6 rounded-2xl flex flex-col gap-3">
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
        </div>
    )
}