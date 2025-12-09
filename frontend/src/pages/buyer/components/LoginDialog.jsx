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
                "
            ariaHideApp={false}
            style={{
                overlay: {
                    zIndex: 10,
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',   // darken overlay
                    backdropFilter: 'blur(8px)',            // apply blur
                    WebkitBackdropFilter: 'blur(8px)',      // Safari support
                },
            }}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
        >
            <div className="w-280 rounded-3xl bg-white p-11">
                <h1 className="h2">Welcome Back</h1>
                <p className="p2 mt-6   ">Log in to manage your listings and connect with property owners</p>

                <form className="mt-6 flex flex-col gap-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email" name="email" label={"Email"} placeholder={"user@gmail.com"}
                            className={'mt-3'}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Password</Label>
                        <Input
                            id="password" name="password" type="password"
                            label={"Password"} placeholder={"insert password"}
                            className={'mt-3'}
                        />
                        <div className="text-right mt-4">Forgot Password</div>
                    </div>
                </form>

                <div className="text-center mt-1">
                    Does not have an account ?<strong className="ml-2">Sign up</strong>
                </div>
                <div className="flex justify-end mt-11">
                    <Button variant={'outline'} className={"rounded-[80px] py-4 px-12"}>Cancel</Button>
                    <Button variant={'default'} className={"ml-7 rounded-[80px] py-4 px-12"}>Confirm</Button>
                </div>


            </div>
        </ReactModal>
    )
}