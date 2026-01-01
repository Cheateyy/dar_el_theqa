import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { OFFER_TYPE } from "../enum"
import { useSearch } from "../searchResults/context/searchContext"

/**
 * contains Buy/Rent options
 */
export function SearchFiltersWrapper({ className, children }) {
    const { selected_offer_type, set_selected_offer_type } = useSearch()
    return (
        <div className={className}>
            {/* this div is reponsible for inner stacking context */}
            <div className="relative z-0">
                <div className="flex justify-end relative z-10">
                    <ButtonGroup className={'relative top-11 w-104 h-28'}>
                        <Button
                            variant={selected_offer_type == OFFER_TYPE.RENT ? 'secondary' : 'default'}
                            size={'lg'}
                            className={'flex-1 h-full items-start'}
                            onClick={() => set_selected_offer_type(OFFER_TYPE.BUY)}
                        >
                            <p className="mt-3 w-18 h-15 px-4 py-3">Rent</p>
                        </Button>
                        <Button
                            variant={selected_offer_type == OFFER_TYPE.BUY ? 'secondary' : 'default'}
                            size={'lg'}
                            className={'flex-1 h-full items-start'}
                            onClick={() => set_selected_offer_type(OFFER_TYPE.RENT)}
                        >
                            <p className="mt-3 w-18 h-15 px-4 py-3 ">Buy</p>
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="w-full p-10 shadow-xl rounded-xl outline bg-white relative z-20">
                    {children}
                </div>
            </div>
        </div>
    )
}