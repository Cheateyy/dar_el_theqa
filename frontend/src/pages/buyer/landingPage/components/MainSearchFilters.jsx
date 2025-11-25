import { FilterCombobox } from "../../components/FilterCombobox"
import { useState } from "react"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"

import { OFFER_TYPE } from "../../types"


export default function MainSearchFilters({ className }) {
  const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
  return (
    <SearchFiltersWrapper className={className}
      selectedOfferType={selectedOfferType}
      setSelectedOfferType={setSelectedOfferType}>
      <div className="grid grid-cols-2 gap-5">
        <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Wilaya" />
        <FilterCombobox className={'w-full h-32 rounded-2xl'} options={[]} filtername="Type" />
      </div>
    </SearchFiltersWrapper>
  )
}

