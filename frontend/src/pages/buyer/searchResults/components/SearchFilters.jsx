import { useState } from "react"

import { MoreFilters } from "@/pages/buyer/searchResults/components/MoreFilters"

import closeSvg from '../assets/close.svg'
import ReactModal from "react-modal"
import { MainSearchFilters } from "./MainSearchFilters"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

ReactModal.setAppElement('#root'); // Or whatever your main app container ID is

export function SearchFilters({ className }) {
    const [is_dialog_open, set_is_dialog_open] = useState(false)

    return (
        <div>
            <div role="static-filters" className={className}>
                <MainSearchFilters
                    dialog_control={[is_dialog_open, set_is_dialog_open]}
                />
                <ApplyFiltersButton />
            </div>

            <ReactModal
                isOpen={is_dialog_open}
                onRequestClose={() => set_is_dialog_open(false)}
                className="
                    fixed left-1/2 top-1/2 
                    transform -translate-x-1/2 -translate-y-1/2 

                    w-[95vw] max-w-lg 
                    md:max-w-3xl 
                    lg:max-w-4xl 

                    max-h-[90vh] overflow-y-auto
                    rounded-xl shadow-xl p-4
                    z-50
                "
                ariaHideApp={false}
                style={{
                    overlay: {
                        zIndex: 10,
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',   // darken overlay
                        backdropFilter: 'blur(8px)',            // apply blur
                        WebkitBackdropFilter: 'blur(8px)',      // Safari support
                    },
                }}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
            >

                <div role="close dialog" className="flex">
                    <button className="mr-auto p-4 bg-white rounded-full cursor-pointer"
                        onClick={() => set_is_dialog_open(false)}
                    >
                        <img src={closeSvg} alt="close" />
                    </button>
                </div>

                <MainSearchFilters
                    dialog_control={[is_dialog_open, set_is_dialog_open]}
                />

                <MoreFilters
                    className={"mt-8 p-10 rounded-2xl bg-white"}
                />
            </ReactModal>
        </div>
    )
}

function ApplyFiltersButton() {
    return (
        <div className="flex justify-center items-center">
            <Button className="mt-6 md:mt-10 w-full max-w-xs md:max-w-sm py-3 px-4">
                Apply filters
                <ArrowRight className="ml-3" />
            </Button>
        </div>
    )
}

