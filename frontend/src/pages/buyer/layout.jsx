import { Outlet } from "react-router-dom";
import { BuyerHeader } from "./components/Header";
import { ListingProvider } from "./context/ListingsContext";

export function BuyerLayout() {
    return (
        <ListingProvider>
            <div>
                <BuyerHeader />
                <Outlet />
            </div>
        </ListingProvider>
    )
}