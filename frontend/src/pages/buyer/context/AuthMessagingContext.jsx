import { createContext, useContext, useState } from "react"
import { LoginDialog } from "../components/LoginDialog"

/**
 * @typedef MessagingStore
 * @property {boolean} is_login_dlg_open
 * @property {import('react').Dispatch<import('react').SetStateAction<boolean>>} set_is_login_dlg_open
 */
const AuthMessagingContext = createContext(null)

export function AuthMessagingProvider({ children }) {
    /**@type {StateControl<boolean>} */
    const [is_login_dlg_open, set_is_login_dlg_open] = useState(false)

    return (
        <AuthMessagingContext.Provider value={{ is_login_dlg_open, set_is_login_dlg_open }}>
            {children}
            <LoginDialog state_control={[is_login_dlg_open, set_is_login_dlg_open]} />
        </AuthMessagingContext.Provider>
    )
}

/**@returns {MessagingStore} */
export const useAuthMessaging = () => useContext(AuthMessagingContext)
