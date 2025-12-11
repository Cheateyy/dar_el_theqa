import { RadioGroupDemo } from "@/components/common/RadioGroup"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import ReactModal from "react-modal"
import { delete_listing } from "../lib/api"

/**
 * @param {Object} props
 * @param {StateControl<boolean>} props.state_control
 * @param {int} props.listing_id
 */
export function DeleteListingDialog({ state_control, listing_id }) {
    const [is_dlg_open, set_is_dlg_open] = state_control
    const [reason, set_reason] = useState(null)

    const delete_cause_options = [
        { value: "The property has been sold/rented", label: "The property has been sold/rented" },
        { value: "I created a duplicate listing", label: "I created a duplicate listing" },
        { value: "I no longer want to list this property", label: "I no longer want to list this property" },
        { value: "other", label: "other" },
    ]
    async function handle_delete_listing(e) {
        e.preventDefault()
        const res = await delete_listing(listing_id, { reason, })
        if (res) {
            set_reason("")
            set_is_dlg_open("")
            return true;
        }
        else {
            console.error("(DeleteListingDialg) Failed to delete listing #", listing_id)
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
                    Delete Listing ?
                </h1>

                <form className="mt-6 flex flex-col gap-4 sm:gap-6" onSubmit={handle_delete_listing}>
                    <div>
                        <Label htmlFor="property-status" className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6">
                            The action is permanent.
                            <br />
                            Before deleting, please tell us why:
                        </Label>
                        <RadioGroupDemo options={delete_cause_options} className="mt-4" state_control={[reason, set_reason]} />
                    </div>
                </form>



                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8 sm:mt-11">
                    <Button
                        variant="outline"
                        className="rounded-full py-4 px-8 sm:px-12 w-full sm:w-auto"
                        onClick={() => set_is_dlg_open(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        className="rounded-full py-4 px-8 sm:px-12 w-full sm:w-auto"
                        onClick={(e) => handle_delete_listing(e)}
                    >
                        Pause Listing
                    </Button>
                </div>
            </div>
        </ReactModal>
    )
}