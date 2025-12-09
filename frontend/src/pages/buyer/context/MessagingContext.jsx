import { createContext, useContext, useState } from "react"
import { Outlet } from "react-router-dom"
import { LoginDialog } from "../components/LoginDialog"

/**
 * @typedef MessagingStore
 * @property {boolean} is_login_dlg_open
 * @property {import('react').Dispatch<import('react').SetStateAction<boolean>>} set_is_login_dlg_open
 */
const MessagingContext = createContext(null)

export function MessagingProvider({ children }) {
    /**@type {StateControl<boolean>} */
    const [is_login_dlg_open, set_is_login_dlg_open] = useState(false)

    return (
        <MessagingContext.Provider value={{ is_login_dlg_open, set_is_login_dlg_open }}>
            {children}
            <LoginDialog state_control={[is_login_dlg_open, set_is_login_dlg_open]} />
        </MessagingContext.Provider>
    )
}

/**@returns {MessagingStore} */
export const useMessaging = () => useContext(MessagingContext)
