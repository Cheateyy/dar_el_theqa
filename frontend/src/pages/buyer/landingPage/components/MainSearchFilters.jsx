import { FilterCombobox } from "../../components/FilterCombobox"
import { SearchFiltersWrapper } from "../../components/SearchFiltersWrapper"
import { useListings } from "../../context/ListingsContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useWilayaOptions } from "../../lib/hooks"
import { useSearch } from "../../searchResults/context/searchContext"

/**@type {import('@/types/common')} */

/**
 * @typedef MainSearchFilters
 * @property {int} wilaya_id
 * @property {string} type
 */

export default function MainSearchFilters({ className }) {
  const navigate = useNavigate()
  const { selected_offer_type, set_selected_offer_type } = useSearch()
  const { filters, set_filters, } = useSearch()
  const { property_types } = useListings()
  const wilayas_options = useWilayaOptions()

  return (
    <div className={className}>
      <SearchFiltersWrapper
        selectedOfferType={selected_offer_type}
        setSelectedOfferType={set_selected_offer_type}>
        <div className="flex flex-col sm:flex-col md:flex-row gap-5">
          <FilterCombobox
            filtername="Wilaya"
            input_control={[filters.wilaya_id, (new_wilaya_id) => set_filters(prev => ({ ...prev, wilaya_id: new_wilaya_id }))]}
            className={'flex-1 h-32 rounded-2xl'}
            options={wilayas_options}
          />
          <FilterCombobox
            filtername="Type"
            input_control={[filters.property_type, (new_type) => set_filters(prev => ({ ...prev, property_type: new_type }))]}
            className={'flex-1 h-32 rounded-2xl'}
            options={property_types}
          />
        </div>
      </SearchFiltersWrapper>
      <div className="flex justify-center items-center mt-4">
        <Button onClick={() => {
          navigate("/search-results")
        }}>
          <span>Search Listings</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

