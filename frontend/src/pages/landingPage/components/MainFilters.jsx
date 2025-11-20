import { Combobox } from "@/components/common/Combobox"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"

export default function MainFilters() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <div className="relative max-w-274 h-49 p-10 shadow-xl rounded-xl isolate outline z-0">
      <div className="grid grid-cols-2 overflow-hidden relative gap-5">
        <Combobox className={'w-full h-32'} options={[]} />
        <Combobox className={'w-full h-32'} options={[]} />
      </div>
      <ButtonGroup className={'absolute right-0 -top-5 w-104 -z-10'}>
        <Button variant={selectedIndex == 0 ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}>Rent</Button>
        <Button variant={selectedIndex == 1 ? 'secondary' : 'default'} size={'lg'} className={'flex-1'}>Buy</Button>
      </ButtonGroup>
    </div>
  )
}