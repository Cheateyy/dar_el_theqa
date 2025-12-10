import { Combobox } from "@/components/common/Combobox";
import addSvg from "@/assets/icons/add.svg"
import { ListingGrid } from "@/components/common/ListingGrid";
import { useListings } from "../buyer/context/ListingsContext";

export default function MyListings() {
    const { listings } = useListings()

    return (
        <div className="px-20">
            <section>
                <h1 className="h1 text-center">My Listings</h1>
                <div className="flex items-center justify-end">
                    <Combobox className="h-18" label="Status" options={[{ label: "All", value: "All" }]} />
                    <div className="p-4 bg-primary rounded-full ml-8">
                        <img src={addSvg} alt="add" />
                    </div>
                </div>
            </section>
            <ListingGrid listings={listings} card_type="seller" />
        </div>
    )
}