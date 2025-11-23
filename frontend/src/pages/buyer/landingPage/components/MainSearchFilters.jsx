import { FilterCombobox } from "../../components/FilterCombobox"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"

import { OFFER_TYPE } from "../../types"


export default function MainSearchFilters({ className }) {
  const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
  return (
    <div className={className}>
      {/* this div is reponsible for inner stacking context */}
      <div className="relative z-0">
        <div className="flex justify-end relative z-10">
          <ButtonGroup className={'relative top-11 w-104 h-28'}>
            <Button
              variant={selectedOfferType == OFFER_TYPE.RENT ? 'secondary' : 'default'}
              size={'lg'}
              className={'flex-1 h-full items-start'}
              onClick={() => setSelectedOfferType(OFFER_TYPE.BUY)}
            >
              <p className="mt-3 w-18 h-15 px-4 py-3">Rent</p>
            </Button>
            <Button
              variant={selectedOfferType == OFFER_TYPE.BUY ? 'secondary' : 'default'}
              size={'lg'}
              className={'flex-1 h-full items-start'}
              onClick={() => setSelectedOfferType(OFFER_TYPE.RENT)}
            >
              <p className="mt-3 w-18 h-15 px-4 py-3 ">Buy</p>
            </Button>
          </ButtonGroup>
        </div>
        <div className="w-full h-49 p-10 shadow-xl rounded-xl outline bg-white relative z-20">
          <div className="grid grid-cols-2 gap-5">
            <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Wilaya" />
            <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Type" />
          </div>
        </div>
      </div>
    </div>
  )
}