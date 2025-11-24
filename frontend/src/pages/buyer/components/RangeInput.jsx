import { cn } from "@/lib/utils"

export function RangeInput({ className, label, unit }) {
    return (
        <div
            role="rangeInput"
            className={cn("w-104 border shadow-xs p-6 rounded-2xl flex flex-col gap-3", className)}
        >
            <p className="font-medium">{label}</p>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    pattern="[0-9]*"
                    className="min-w-10 px-2 py-1 text-sm"
                    placeholder="0"
                />

                <span>-</span>

                <input
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