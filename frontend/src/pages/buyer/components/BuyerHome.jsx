import logo from "@/assets/images/logo.png"
import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"

export default function BuyerHome() {
    return (
        <header>
            <div className="flex flex-row px-16 justify-between">
                <div className="relative -left-10">
                    <img src={logo} alt="logo" />
                </div>
                <div className="flex flex-row items-center">
                    <Button className="w-28 h-12 mr-3 text-gray-600" variant={'ghost'}>
                        <GlobeIcon />
                        Language
                    </Button>
                    <Button className="w-38 h-12 p-3">Log In</Button>
                </div>
            </div>
        </header>
    )
}


export function ButtonDemo() {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button variant="default">Button</Button>
            <Button variant="outline" size="icon" aria-label="Submit">
                <ArrowUpIcon />
            </Button>
        </div>
    )
}
