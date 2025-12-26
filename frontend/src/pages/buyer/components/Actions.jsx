import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import { CustomDropdownMenu } from "@/components/common/DropDownMenu"

import BellSvg from '../assets/bell.svg'
import ProfileSvg from '../assets/profile.svg'
import HamburgerSvg from '../assets/hamburger.svg'
import dashboardSvg from '../assets/dashboard.svg'
import homeSvg from '../assets/home.svg'
import searchSvg from '../assets/search.svg'
import menuHeartSvg from '../assets/menuHeart.svg'
import messageSvg from '../assets/message.svg'
import logoutSvg from '../assets/logout.svg'
import { useState } from "react"
import { Combobox } from "@/components/common/Combobox"
import { useAuthMessaging } from "../context/AuthMessagingContext"
import { useNavigate } from "react-router-dom"
import AuthService from "@/services/authService"
import { useAuth } from "@/contexts/AuthContext"

function LanguageSelector({ className }) {
    const langs = ["arabic", "english", "language"];
    const [language, set_language] = useState(langs[0])

    return (
        <div className="flex items-center">
            <GlobeIcon className="w-5 h-5" />
            <Combobox
                className={className} options={langs.map(lang => ({ label: lang, value: lang }))}
                label="language" state_control={[language, set_language]} variant='ghost'
            />
        </div>
    )
}

function MenuButton() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    /**@type {import("@/components/common/DropDownMenu").DropDownMenuOption[]} */
    const options = [
        { label: "Home", icon: homeSvg, onClick: () => navigate("/") },
        { label: "Find a Property", icon: searchSvg, onClick: () => navigate("/search-results") },
        { label: "Favorites", icon: menuHeartSvg, onClick: () => navigate("/favorites") },
        { label: "Contacted Properties", icon: messageSvg, onClick: () => navigate("/interests") },
        { label: "Log out", icon: logoutSvg, onClick: async () => await logout() },
    ]

    return (
        <CustomDropdownMenu
            variant="ghost"
            options={options}
        >
            <img src={HamburgerSvg} alt="menu" className="w-6 h-6" />
        </CustomDropdownMenu>
    )
}

export function NotLoggedInActions() {
    const { set_is_login_dlg_open } = useAuthMessaging()
    return (
        <div className="flex items-center gap-3">
            {/* show full language selector on md+, only icon on small */}
            <div className="flex items-center">
                <LanguageSelector />
            </div>

            <Button className="px-3 py-2 text-sm md:px-4 md:py-3"
                onClick={() => set_is_login_dlg_open(prev => !prev)}>
                Log In
            </Button>
        </div>
    )
}

export function LoggedInBuyerActions() {
    return (
        <div className="flex items-center gap-3">
            {/* keep all actions visible on all breakpoints, adapt sizing & labels */}
            <LanguageSelector />

            {/* List button: show icon always, label appears from sm+ */}
            <Button
                className="ml-0 sm:ml-4 flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md"
                variant='outline'
            >
                <img src={dashboardSvg} alt="list" className="w-5 h-5" />
                <span className="hidden sm:inline">List your property</span>
            </Button>

            <div className="flex items-center gap-2 ml-0 sm:ml-5">
                <Button variant='ghost' size='icon' className='w-10 h-10 sm:w-12 sm:h-12'>
                    <img src={BellSvg} alt="notifications" />
                </Button>
                <Button variant='ghost' size='icon' className='w-10 h-10 sm:w-12 sm:h-12'>
                    <img src={ProfileSvg} alt="profile" />
                </Button>
                <MenuButton />
            </div>
        </div>
    )
}

export function LoggedInSellerActions() {
    return (
        <div className="flex items-center gap-3">
            {/* keep all actions visible on all breakpoints, adapt sizing & labels */}
            <LanguageSelector />

            {/* Dashboard: show icon always, label appears from sm+ */}
            <Button
                className="ml-0 sm:ml-4 flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md"
                variant="outline"
            >
                <img src={dashboardSvg} alt="dashboard" className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <div className="flex items-center gap-2 ml-0 sm:ml-5">
                <Button variant='ghost' size='icon' className='w-10 h-10 sm:w-12 sm:h-12'>
                    <img src={BellSvg} alt="notifications" />
                </Button>
                <Button variant='ghost' size='icon' className='w-10 h-10 sm:w-12 sm:h-12'>
                    <img src={ProfileSvg} alt="profile" />
                </Button>
                <MenuButton />
            </div>
        </div>
    )
}

