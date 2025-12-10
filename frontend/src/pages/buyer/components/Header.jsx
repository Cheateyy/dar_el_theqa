import logoSvg from "@/assets/images/logo.svg";
import { LoggedInBuyerActions, LoggedInSellerActions, NotLoggedInActions } from "./Actions";

export function BuyerHeader() {
    return <header>
        <div className="flex flex-row px-4 sm:px-8 md:px-16 justify-between items-center">
            {/* responsive logo: fixed aspect, scales across breakpoints, prevents shrinking */}
            <div className="md:relative md:-left-10 top-4 shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
                <img src={logoSvg} alt="logo" className="w-full h-full object-contain" />
            </div>
            {/* <LoggedInSellerActions /> */}
            {/* <NotLoggedInActions /> */}
            <LoggedInBuyerActions />
        </div>
    </header>
}