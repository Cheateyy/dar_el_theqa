import { Label } from "@/components/ui/label"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { useState } from "react"

/**
 * @param {Object} props
 * @param {Option[]} props.options
 * @param {string} props.name
 * @param {StateControl<string>} props.state_control
 */
export function RadioGroupDemo({ className, options, name, state_control }) {
    if (!state_control) {
        return <UncontrolledRadioGroupDemo className={className} options={options} name={name} />
    }
    else {
        return <ControlledRadioGroupDemo
            className={className} options={options}
            name={name} state_control={state_control}
        />
    }
}

export function ControlledRadioGroupDemo({ className, options, name, state_control }) {
    if (!options) {
        return "No options provided for Radio Group"
    }
    name = name ?? "radio-group"
    return (
        <RadioGroup defaultValue="comfortable" className={className} name={name}
            state_control={state_control}
        >
            {options.map((option, index) => <div className="flex items-center gap-3">
                <RadioGroupItem key={option} value={option.value} id={`item-${index}`} />
                <Label htmlFor={`item-${index}`} >{option.label}</Label>
            </div>)}
        </RadioGroup>
    )
}

export function UncontrolledRadioGroupDemo({ className, options, name, }) {
    const [value, set_value] = useState("")

    if (!options) {
        return "No options provided for Radio Group"
    }
    name = name ?? "radio-group"
    return (
        <RadioGroup defaultValue="comfortable" className={className} name={name}
            state_control={[value, set_value]}
        >
            {options.map((option, index) => <div className="flex items-center gap-3">
                <RadioGroupItem key={option} value={option.value} id={`item-${index}`} />
                <Label htmlFor={`item-${index}`} >{option.label}</Label>
            </div>)}
        </RadioGroup>
    )
}