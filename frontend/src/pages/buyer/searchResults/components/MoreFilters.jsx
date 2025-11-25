import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ReactModal from "react-modal"

import filterIcon from '../assets/filter.svg'
import switchOffIcon from '../assets/switchOff.svg'
import switchOnIcon from '../assets/switchOn.svg'
import starIcon from '../assets/star.svg'

import { RangeInput } from "../../components/RangeInput"
import { useState } from "react"
import { Label } from "@radix-ui/react-dropdown-menu"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PopoverAnchor } from "@radix-ui/react-popover"


const SWITCH_STATUS = {
    OFF: 0,
    ON: 1,
}

ReactModal.setAppElement('#root'); // Or whatever your main app container ID is

export function MoreFilters({ isOpen, setIsOpen }) {
    const [switchStatus, setSwitchStatus] = useState(SWITCH_STATUS.ON)
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto"
            // overlayClassName="fixed inset-0 flex items-center justify-center p-4"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <h4 className="h4">More Filters</h4>
            <div role="switch">
                <button className="cursor-pointer"
                    onClick={() => setSwitchStatus((prev) => prev == SWITCH_STATUS.ON ? SWITCH_STATUS.OFF : SWITCH_STATUS.ON)}>
                    <img
                        src={switchStatus == SWITCH_STATUS.ON ? switchOnIcon : switchOffIcon}
                        alt="verifed doc switch" className="inline" />
                </button>
                <p className="ml-1 inline">Only show verified properties where all the documents are provided by the owner</p>
            </div>
            <div role="filters" className="flex flex-col gap-6 items-stretch">
                <div className="flex gap-5">
                    <RangeInput label="Area" unit={"m2"} />
                    <FilterInput label={"floors"} />
                    <FilterInput label={"Bedrooms"} />
                    <FilterInput label={"Bathrooms"} />
                </div>
                <div>
                    <FilterInput className="w-full" label={"Ratings"} unit={<img src={starIcon} alt="start icon" />} />
                </div>
            </div>
            <div role="actions" className="flex">
                <Button variant={'ghost'} className={'text-red-500'}>Clear All</Button>
                <Button variant={'default'} className={'ml-auto'}>
                    Apply filters
                    <ArrowRight />
                </Button>
            </div>
        </ReactModal>
    )
}

function FilterInput({ className, label, unit, }) {
    return (
        <div className={cn("w-48 border shadox-xs rounded-2xl py-5 px-6 flex justify-start", className)}>
            <div className="flex flex-col justify-center">
                <Label>{label}</Label>
                <div className="flex">
                    <input type="text" placeholder="Any" className="w-12" />
                    {unit}
                </div>
            </div>
        </div>
    )
}