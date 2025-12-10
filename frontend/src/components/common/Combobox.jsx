import * as React from "react"
import { Check, ChevronsDown } from "lucide-react"

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
/**@type {import('@/types/common')} */

/**
 * @typedef {object} Option
 * @property {string | number} value - The unique value of the option.
 * @property {string} label - The human-readable label displayed to the user.
 */

export function Combobox({ className, options, state_control }) {
    if (state_control) {
        return <ControlledCombobox className={className} options={options} state_control={state_control} />
    }
    else {
        return
    }
}

/**
 * A custom combobox component for selecting an option from a list.
 * * @param {object} props - The component props.
 * @param {Array<Option>} props.options - The list of available options.
 * @param {StateControl<string>} props.state_control
 */
function ControlledCombobox({ className, options, state_control }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = state_control

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    {value
                        ? options.find((options) => options.value === value)?.label
                        : "Select options..."}
                    <ChevronsDown className="opacity-50" />
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

/**
 * A custom combobox component for selecting an option from a list.
 * * @param {object} props - The component props.
 * @param {Array<Option>} props.options - The list of available options.
 * @param {StateControl<string>} props.state_control
 */
function UncontrolledCombobox({ className, options }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    {value
                        ? options.find((options) => options.value === value)?.label
                        : "Select options..."}
                    <ChevronsDown className="opacity-50" />
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