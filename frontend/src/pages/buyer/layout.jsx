import { Outlet } from "react-router-dom";
import { BuyerHeader } from "./components/Header";
import { ListingProvider } from "./context/ListingsContext";
import { MessagingProvider } from "./context/MessagingContext";

export function BuyerLayout() {
    return (
        <ListingProvider>
            <MessagingProvider>
                <BuyerHeader />
                <Outlet />
                <footer className="mt-20">
                </footer>
            </MessagingProvider>
        </ListingProvider>


    )
}