import logo from "@/assets/images/logo.png";
import { LoggedInBuyerActions, LoggedInSellerActions, NotLoggedInActions } from "./Actions";

export function BuyerHeader() {
    return <header>
        <div className="flex flex-row px-16 justify-between">
            <div className="relative -left-10 top-4 max-w-52 max-h-52">
                <img src={logo} alt="logo" />
            </div>
            {/* <LoggedInSellerActions /> */}
            {/* <NotLoggedInActions /> */}
            <LoggedInBuyerActions />
        </div>
    </header>
}