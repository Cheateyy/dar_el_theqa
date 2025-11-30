import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import arrowDown from '../assets/arrowDown.svg'

/**
 * @typedef {object} Option
 * @property {string | number} value - The unique value of the option.
 * @property {string} label - The human-readable label displayed to the user.
 */

/**
 * A custom combobox component for selecting an option from a list.
 * * @param {object} props - The component props.
 * @param {Array<Option>} props.options - The list of available options.
 * 
 * **NOTE**:
 * This differ from Combobox by PopoverTrigger>Button styling
 */
export function FilterCombobox({ className, options, filtername }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] h-32 flex-col items-start", className)}
                >
                    <h4>{filtername}</h4>
                    <div>
                        {value
                            ? options.find((options) => options.value === value)?.label
                            : "select " + filtername.toLowerCase()}
                    </div>
                    <div>
                        <span>change</span>
                        <img src={arrowDown} alt="" className="ml-2 inline" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className={cn(
                    "w-[200px] p-0",
                    className
                )}
            >                <Command>
                    <CommandInput placeholder="Search options..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((options) => (
                                <CommandItem
                                    key={options.value}
                                    value={options.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {options.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === options.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
