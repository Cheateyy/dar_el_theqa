import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import BellSvg from '../assets/bell.svg'
import ProfileSvg from '../assets/profile.svg'
import HamburgerSvg from '../assets/hamburger.svg'
import dashboardSvg from '../assets/dashboard.svg'
import { CustomDropdownMenu } from "@/components/common/DropDownMenu"

export function LanguageSelector({ className }) {
    return <CustomDropdownMenu className={className} options={["arabic", "english", "language"]}>
        <GlobeIcon />
        <span>Language</span>
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
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={HamburgerSvg} alt="" />
            </Button>
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
            <Button variant='ghost' size='icon' className='w-15 h-15'>
                <img src={HamburgerSvg} alt="" />
            </Button>
        </div>
    </div>
}