import { RadioGroupDemo } from "@/components/common/RadioGroup"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import ReactModal from "react-modal"
import { pause_listing } from "../lib/api"

/**
 * @param {Object} props
 * @param {StateControl<boolean>} props.state_control
 */
export function UpdateListingDialog({ listing_id, state_control }) {
    /**@type {StateControl<string>} */
    const [reason, set_reason] = useState(null)
    const [auto_activate_date, set_auto_activate_date] = useState(null)

    const [is_dlg_open, set_is_dlg_open] = state_control

    const what_happened_options = [
        { value: "The property has been rented", label: "The property has been rented" },
        { value: "I want to pause it for now", label: "I want to pause it for now" },
        { value: "other", label: "other" },
    ]

    /**@returns {Promise<boolean>} */
    async function handle_pause_listing(e) {
        e.preventDefault()
        const res = await pause_listing(listing_id, { reason, auto_activate_date })
        console.log(res)
        if (res.status == 'success') {
            set_reason("")
            set_auto_activate_date(null)
            set_is_dlg_open(false)
            return true;
        }
        else {
            console.error(`(UpdateListingDialog) Failure: ${res.message}`)
            return false;
        }
    }

    return (
        <ReactModal
            isOpen={is_dlg_open}
            onRequestClose={() => set_is_dlg_open(false)}
            className="
                    fixed left-1/2 top-1/2 
                    transform -translate-x-1/2 -translate-y-1/2 
                    max-h-[90vh] overflow-y-auto
                    rounded-xl shadow-xl
                    z-50
                    w-[calc(100%-2rem)] max-w-[280px] sm:max-w-md md:max-w-lg
                "
            ariaHideApp={false}
            style={{
                overlay: {
                    zIndex: 10,
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                },
            }}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <div className="rounded-3xl bg-white p-6 sm:p-8 md:p-11">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Update Listing Status
                </h1>

                <form className="mt-6 flex flex-col gap-4 sm:gap-6" onSubmit={(e) => handle_pause_listing(e)}>
                    <div>
                        <Label htmlFor="property-status" className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6">
                            What happened to the property ?
                        </Label>
                        <RadioGroupDemo options={what_happened_options} className="mt-4" name="reason"
                            state_control={[reason, set_reason]}
                        />
                    </div>
                    <div>
                        <Label htmlFor="reactivate-date">
                            <p className="p2">Reactivate Automatically on:</p>
                        </Label>
                        <DateTimePicker className="mt-4" state_control={[auto_activate_date, set_auto_activate_date]} />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8 sm:mt-11">
                        <Button
                            variant="outline"
                            className="rounded-full py-4 px-8 sm:px-12 w-full sm:w-auto"
                            onClick={() => set_is_dlg_open(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            // role="submit"
                            variant="default"
                            className="rounded-full py-4 px-8 sm:px-12 w-full sm:w-auto"
                        >
                            Pause Listing
                        </Button>
                    </div>
                </form>
            </div>
        </ReactModal>
    )
}