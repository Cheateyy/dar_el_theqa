import { createContext, useContext, useState } from "react"
import { UpdateListingDialog } from "../components/UpdateListingDialog"

/**
 * @typedef MessagingStore
 * @property {boolean} is_update_dlg_open
 * @property {import('react').Dispatch<import('react').SetStateAction<boolean>>} set_is_update_dlg_open
 */
const ListingsMessagingContext = createContext(null)

export function ListingsMessagingProvider({ children }) {
    /**@type {StateControl<boolean>} */
    const [is_update_dlg_open, set_is_update_dlg_open] = useState(false)

    return (
        <ListingsMessagingContext.Provider value={{ is_update_dlg_open, set_is_update_dlg_open }}>
            {children}
            <UpdateListingDialog state_control={[is_update_dlg_open, set_is_update_dlg_open]} />
        </ListingsMessagingContext.Provider>
    )
}

/**@returns {MessagingStore} */
export const useListingsMessaging = () => useContext(ListingsMessagingContext)
