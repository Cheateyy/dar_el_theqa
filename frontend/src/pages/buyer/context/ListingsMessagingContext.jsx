import { createContext, useContext, useState } from "react"
import { UpdateListingDialog } from "../components/UpdateListingDialog"
import { DeleteListingDialog } from "../components/DeleteListingDialog"

/**
 * @typedef MessagingStore
 * @property {(listing_id: int) => void} open_update_listing_dlg
 * @property {(listing_id: int) => void} open_delete_listing_dlg
 */
const ListingsMessagingContext = createContext(null)

export function ListingsMessagingProvider({ children }) {
    /**@type {StateControl<boolean>} */
    const [is_update_dlg_open, set_is_update_dlg_open] = useState(false)
    /**@type {StateControl<int>} */
    const [updating_listing_id, set_updating_listing_id] = useState(null)

    /**@type {StateControl<boolean>} */
    const [is_delete_dlg_open, set_is_delete_dlg_open] = useState(false)
    /**@type {StateControl<int>} */
    const [deleting_listing_id, set_deleting_listing_id] = useState(null)

    /**@type {(listing_id: int) => void} */
    function open_update_listing_dlg(listing_id) {
        set_updating_listing_id(listing_id);
        set_is_update_dlg_open(true)
    }

    /**@type {(listing_id: int) => void} */
    function open_delete_listing_dlg(listing_id) {
        set_deleting_listing_id(listing_id);
        set_is_delete_dlg_open(true)
    }

    return (
        <ListingsMessagingContext.Provider
            value={{ open_update_listing_dlg, open_delete_listing_dlg }}>
            {children}
            <UpdateListingDialog state_control={[is_update_dlg_open, set_is_update_dlg_open]} listing_id={updating_listing_id} />
            <DeleteListingDialog state_control={[is_delete_dlg_open, set_is_delete_dlg_open]} listing_id={deleting_listing_id} />
        </ListingsMessagingContext.Provider>
    )
}

/**@returns {MessagingStore} */
export const useListingsMessaging = () => useContext(ListingsMessagingContext)
