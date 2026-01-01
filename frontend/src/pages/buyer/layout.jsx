import { Outlet } from "react-router-dom";
import { Header } from "../../components/common/Header";
import { ListingProvider } from "./context/ListingsContext";
import { AuthMessagingProvider } from "./context/AuthMessagingContext";
import { ListingsMessagingProvider } from "./context/ListingsMessagingContext";
import { SearchProvider } from "./searchResults/context/searchContext";

export function BuyerLayout() {
    return (
        <ListingProvider>
            <AuthMessagingProvider>
                <ListingsMessagingProvider>
                    <Header />
                    <SearchProvider>
                        <Outlet />
                    </SearchProvider>
                    <footer className="mt-20">
                    </footer>
                </ListingsMessagingProvider>
            </AuthMessagingProvider>
        </ListingProvider>


    )
}