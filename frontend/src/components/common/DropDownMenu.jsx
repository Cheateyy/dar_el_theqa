import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

/**
 * A custom combobox component for selecting an option from a list.
 *
 * @param {object} props - The component props.
 * @param {Array<string>} props.options - The list of available options.
 * @param {string} props.variant - The visual variant of the button
 */
export function CustomDropdownMenu({ className, options, variant, children }) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant={variant}>{children}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        {options.map((option) => <DropdownMenuItem>{option}</DropdownMenuItem>)}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
