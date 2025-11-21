import { FilterCombobox } from "../../components/FilterCombobox"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { OFFER_TYPE } from "../../types"


export default function MainSearchFilters({ className }) {
  const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
  return (
    <div className={cn("relative w-full h-49 p-10 shadow-xl rounded-xl outline bg-white", className)}>
      <div className="grid grid-cols-2 relative gap-5">
        <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Wilaya" />
        <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Type" />
      </div>
      <ButtonGroup className={'absolute right-0 -top-5 w-104 z-[-1]'}>
        <Button
          variant={selectedOfferType == OFFER_TYPE.RENT ? 'secondary' : 'default'}
          size={'lg'}
          className={'flex-1'}
          onClick={() => setSelectedOfferType(OFFER_TYPE.BUY)}
        >
          Rent
        </Button>
        <Button
          variant={selectedOfferType == OFFER_TYPE.BUY ? 'secondary' : 'default'}
          size={'lg'}
          className={'flex-1'}
          onClick={() => setSelectedOfferType(OFFER_TYPE.RENT)}

        >
          Buy
        </Button>
      </ButtonGroup>
    </div>
  )
}