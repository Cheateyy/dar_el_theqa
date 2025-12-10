import { Label } from "@/components/ui/label"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

/**
 * @param {Object} props
 * @param {Option[]} props.options
 * 
 */
export function RadioGroupDemo({ className, options }) {
    if (!options) {
        return "No options provided for Radio Group"
    }
    return (
        <RadioGroup defaultValue="comfortable" className={className}>
            {options.map((option, index) => <div className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={`item-${index}`} />
                <Label htmlFor={`item-${index}`} >{option.label}</Label>
            </div>)}
        </RadioGroup>
    )
}
