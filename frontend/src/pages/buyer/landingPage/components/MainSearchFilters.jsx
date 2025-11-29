import { FilterCombobox } from "../../components/FilterCombobox"
import { useState } from "react"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"

import { OFFER_TYPE } from "../../types"
import { useListings } from "../context/ListingsContext"


export default function MainSearchFilters({ className }) {
  const [selectedOfferType, setSelectedOfferType] = useState(OFFER_TYPE.BUY)
  const { property_types } = useListings()
  const { wilayas } = useListings()
  const wilayas_options = wilayas.map((wilaya) => ({ label: wilaya.name, value: wilaya.name }))

  return (
    <SearchFiltersWrapper className={className}
      selectedOfferType={selectedOfferType}
      setSelectedOfferType={setSelectedOfferType}>
      <div className="flex flex-col sm:flex-col md:flex-row gap-5">
        <FilterCombobox className={'flex-1 h-32 rounded-2xl'} options={wilayas_options} filtername="Wilaya" />
        <FilterCombobox className={'flex-1 h-32 rounded-2xl'} options={property_types} filtername="Type" />
      </div>
    </SearchFiltersWrapper>
  )
}

