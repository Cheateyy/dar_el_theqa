import { RadioGroupDemo } from "@/components/common/RadioGroup"
import { DateTimePicker } from "@/components/DateTimePicker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import ReactModal from "react-modal"

/**
 * @param {Object} props
 * @param {StateControl<boolean>} props.state_control
 */
export function UpdateListingDialog({ state_control }) {
    const [is_dlg_open, set_is_dlg_open] = state_control
    const what_happened_options = [
        { value: "The property has been rented", label: "The property has been rented" },
        { value: "I want to pause it for now", label: "I want to pause it for now" },
        { value: "other", label: "other" },
    ]
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

                <form className="mt-6 flex flex-col gap-4 sm:gap-6">
                    <div>
                        <Label htmlFor="property-status" className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6">
                            What happened to the property ?
                        </Label>
                        <RadioGroupDemo options={what_happened_options} className="mt-4" />
                        {/* <Combobox id="property-status" name="property-status" className="mt-4" options={[what_happened_options]} /> */}
                    </div>
                    <div>
                        <Label htmlFor="reactivate-date">
                            <p2 className="p2">Reactivate Automatically on:</p2>
                        </Label>
                        <DateTimePicker className="mt-4" />
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
                    >
                        Pause Listing
                    </Button>
                </div>
            </div>
        </ReactModal>
    )
}