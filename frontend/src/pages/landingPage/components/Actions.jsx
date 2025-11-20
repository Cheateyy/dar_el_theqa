import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import BellSvg from '../assets/bell.svg'
import ProfileSvg from '../assets/profile.svg'
import HamburgerSvg from '../assets/hamburger.svg'
import dashboardSvg from '../assets/dashboard.svg'
import { CustomDropdownMenu } from "@/components/common/DropDownMenu"
import homeSvg from '../assets/home.svg'
import searchSvg from '../assets/search.svg'
import menuHeartSvg from '../assets/menuHeart.svg'
import messageSvg from '../assets/message.svg'
import logoutSvg from '../assets/logout.svg'

function LanguageSelector({ className }) {
    const langs = ["arabic", "english", "language"];
    return <CustomDropdownMenu className={className} options={langs.map(lang => ({ label: lang }))}>
        <GlobeIcon />
        <span>Language</span>
    </CustomDropdownMenu>
}

function MenuButton() {
    const options = [
        { label: "Home", icon: homeSvg, },
        { label: "Find a Property", icon: searchSvg, },
        { label: "Favorites", icon: menuHeartSvg, },
        { label: "Contacted Properties", icon: messageSvg, },
        { label: "Log out", icon: logoutSvg, },
    ]

    return <CustomDropdownMenu
        variant="ghost"
        options={options}
    >
        <img src={HamburgerSvg} alt="" />
    </CustomDropdownMenu>
}

export function NotLoggedInActions() {
    return <div className="flex flex-row items-center">
        <LanguageSelector />
        <Button className="ml-4 w-38 h-12 p-3">Log In</Button>
    </div>
}
export function LoggedInBuyerActions() {
    return <div className="flex flex-row items-center">
        <LanguageSelector />
        <Button className="ml-4 w-38 h-12 p-3" variant='outline'>List your property</Button>
        <div className="ml-5 flex">
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={BellSvg} alt="" />
            </Button>
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={ProfileSvg} alt="" />
            </Button>
            <MenuButton />
        </div>
    </div>
}



export function LoggedInSellerActions() {
    return <div className="flex flex-row items-center">
        <LanguageSelector />
        <Button className="ml-4 w-38 h-12 p-3" variant='outline'>
            <img src={dashboardSvg} alt="" />
            Dashboard
        </Button>
        <div className="ml-5 flex">
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={BellSvg} alt="" />
            </Button>
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={ProfileSvg} alt="" />
            </Button>
            <MenuButton />
        </div>
    </div>
}

