import { cn } from "@/lib/utils"

/**
 * @param {Object} props
 * @param {InputControl<[string, string]> } props.input_control
 */
export function RangeInput({ className, label, unit, input_control }) {
    const [min_max_values, set_min_max_values] = input_control;

    return (
        <div
            role="rangeInput"
            className={cn("w-104 border shadow-xs p-6 rounded-2xl flex flex-col gap-3", className)}
        >
            <p className="font-medium">{label}</p>

            <div className="flex items-center gap-2">
                <input
                    value={min_max_values[0]}
                    // TODO: handle quick consecutive clicks (we cannot access prev)
                    onChange={(e) => set_min_max_values([e.target.value, min_max_values[1]])}

                    type="text"
                    pattern="[0-9]*"
                    className="min-w-10 px-2 py-1 text-sm"
                    placeholder="0"
                />

                <span>-</span>

                <input
                    value={min_max_values[1]}
                    onChange={(e) => set_min_max_values([min_max_values[0], e.target.value])}

                    type="text"
                    pattern="[0-9]*"
                    className="min-w-10 px-2 py-1 text-sm"
                    placeholder="1000"

                />

                {unit && <span className="text-sm font-bold">{unit}</span>}
            </div>
        </div>
    )
}