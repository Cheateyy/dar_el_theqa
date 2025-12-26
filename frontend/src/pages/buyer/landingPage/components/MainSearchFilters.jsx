import { FilterCombobox } from "../../components/FilterCombobox"
import { useState } from "react"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { OFFER_TYPE } from "../../enum"
import { useListings } from "../../context/ListingsContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useWilayaOptions } from "../../lib/hooks"

/**@type {import('@/types/common')} */

/**
 * @typedef MainSearchFilters
 * @property {int} wilaya_id
 * @property {string} type
 */

export default function MainSearchFilters({ className }) {
  const navigate = useNavigate()
  const [selected_offer_type, set_selected_offer_type] = useState(OFFER_TYPE.BUY)
  const { property_types } = useListings()
  const wilayas_options = useWilayaOptions()

  /**@type {InputControl<MainSearchFilters>} */
  const [input_values, set_input_values] = useState({ wilaya: null, type: null })

  const wilaya_id = input_values.wilaya_id;
  const type = input_values.type;

  return (
    <div className={className}>
      <SearchFiltersWrapper
        selectedOfferType={selected_offer_type}
        setSelectedOfferType={set_selected_offer_type}>
        <div className="flex flex-col sm:flex-col md:flex-row gap-5">
          <FilterCombobox
            filtername="Wilaya"
            input_control={[input_values.wilaya_id, (new_wilaya_id) => set_input_values(prev => ({ ...prev, wilaya_id: new_wilaya_id }))]}
            className={'flex-1 h-32 rounded-2xl'}
            options={wilayas_options}
          />
          <FilterCombobox
            filtername="Type"
            input_control={[input_values.type, (new_type) => set_input_values(prev => ({ ...prev, type: new_type }))]}
            className={'flex-1 h-32 rounded-2xl'}
            options={property_types}
          />
        </div>
      </SearchFiltersWrapper>
      <div className="flex justify-center items-center mt-4">
        <Button onClick={() => navigate({ pathname: "/search-results", search: `?type=${type}&wilaya_id=${wilaya_id}` })}>
          <span>Search Listings</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

