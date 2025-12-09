import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactModal from "react-modal"

/**
 * @param {Object} props
 * @param {StateControl<boolean>} props.state_control
 */
export function LoginDialog({ state_control }) {
    const [is_dlg_open, set_is_dlg_open] = state_control
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
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome Back</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-4 sm:mt-6">
                    Log in to manage your listings and connect with property owners
                </p>

                <div className="mt-6 flex flex-col gap-4 sm:gap-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="user@gmail.com"
                            className="mt-3"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="insert password"
                            className="mt-3"
                        />
                        <div className="text-right mt-4 text-sm text-blue-600 cursor-pointer hover:underline">
                            Forgot Password
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4 sm:mt-6 text-sm sm:text-base">
                    Don't have an account?<strong className="ml-2 cursor-pointer text-blue-600 hover:underline">Sign up</strong>
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
                        variant="default"
                        className="rounded-full py-4 px-8 sm:px-12 w-full sm:w-auto"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </ReactModal>
    )
}