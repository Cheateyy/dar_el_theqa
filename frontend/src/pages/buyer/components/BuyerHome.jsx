import logo from "@/assets/images/logo.png"
import { Button } from "@/components/ui/button"

export default function BuyerHome() {
    return (
        <header>
            <div className="flex flex-row justify-between">
                <img src={logo} alt="logo" />
                <div>
                    <Button>HI</Button>
                    <Button>Hello</Button>
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
