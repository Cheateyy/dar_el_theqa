import { Outlet } from "react-router-dom";
import { BuyerHeader } from "./components/Header";
import { ListingProvider } from "./context/ListingsContext";
import { AuthMessagingProvider } from "./context/AuthMessagingContext";
import { ListingsMessagingProvider } from "./context/ListingsMessagingContext";

export function BuyerLayout() {
    return (
        <ListingProvider>
            <AuthMessagingProvider>
                <ListingsMessagingProvider>
                    <BuyerHeader />
                    <Outlet />
                    <footer className="mt-20">
                    </footer>
                </ListingsMessagingProvider>
            </AuthMessagingProvider>
        </ListingProvider>


    )
}