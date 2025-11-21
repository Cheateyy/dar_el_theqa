import { Outlet } from "react-router-dom";
import { BuyerHeader } from "./components/Header";

export function BuyerLayout() {
    return <div>
        <BuyerHeader />
        <Outlet />
    </div>
}