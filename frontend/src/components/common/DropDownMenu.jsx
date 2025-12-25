import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"


/**
 * @typedef {object} DropDownMenuOption
 * @property {any} img - The unique value of the option.
 * @property {string} label - The human-readable label displayed to the user.
 * @property {() => void} onClick
 */

/**
 * A custom combobox component for selecting an option from a list.
 *
 * @param {object} props - The component props.
 * @param {Array<DropDownMenuOption>} props.options - The list of available options.
 * @param {string} props.variant - The visual variant of the button
 */
export function CustomDropdownMenu({ className, options = [], variant, children, asChild }) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {asChild ? children : <Button variant={variant}>{children}</Button>}

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        {options.map((option, index) =>
                            <DropdownMenuItem key={index}>
                                <div className="flex gap-2" onClick={option.onClick}>
                                    {option.img && <img src={option.img} />}
                                    {option.label}
                                </div>
                            </DropdownMenuItem>)}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
