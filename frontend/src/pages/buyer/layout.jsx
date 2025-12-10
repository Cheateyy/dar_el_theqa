import { Outlet } from "react-router-dom";
import { BuyerHeader } from "./components/Header";
import { ListingProvider } from "./context/ListingsContext";

export function BuyerLayout() {
    return (
        <ListingProvider>
            <BuyerHeader />
            <Outlet />
            <footer className="mt-20">
                .
            </footer>
        </ListingProvider>
    )
}