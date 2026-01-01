import { Combobox } from "@/components/common/Combobox";
import addSvg from "@/assets/icons/add.svg"
import { ListingGrid } from "@/components/common/ListingGrid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { get_my_listings } from "../buyer/lib/api";

export default function MyListings() {
    const [status, set_status] = useState(null)

    const [my_listings, set_my_listings] = useState([])

    useEffect(() => {
        async function fetchData() {
            const api_status = (status == null || status == "All") ? null : status
            const res = await get_my_listings(api_status)
            set_my_listings(res)
        }
        fetchData()
    }, [status])

    const options = [
        { label: "All", value: "All" },
        { label: "Rejected", value: "Rejected" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Inactive", value: "Inactive" },
    ]
    const navigate = useNavigate()
    return (
        <div className="px-20">
            <section>
                <h1 className="h1 text-center">My Listings</h1>
                <div className="flex items-center justify-end mt-11">
                    <Combobox
                        className="h-18" label="Status"
                        options={options}
                        state_control={[status, set_status]}
                    />
                    <div className="p-4 bg-primary rounded-full ml-8">
                        <img src={addSvg} alt="add" onClick={() => navigate("/forms-tables/add-listing")} />
                    </div>
                </div>
            </section>
            <ListingGrid listings={my_listings} card_type="seller" />
        </div>
    )
}