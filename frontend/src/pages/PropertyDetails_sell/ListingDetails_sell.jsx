import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import status_icon from "../../assets/icons/certified_button.png";

import { getListingDetails } from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function ListingDetails_sell() {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await getListingDetails(listingId);
                setListing(data);
            } catch (err) {
                console.error("Error fetching listing data:", err);
                setListing(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [listingId]);

    if (loading) return <p>Loading...</p>;
    if (!listing) return <p>Listing not found.</p>;

    const address = listing.street_address || listing.address || "N/A";
    const region = listing.region || listing.wilaya || "N/A";
    const priceValue = Number(listing.price) || 0;
    const propertyType = listing.property_type || listing.appartement_type || "N/A";
    const areaValue = listing.area || listing.area_m2 || 0;
    const bedrooms = listing.bedrooms ?? listing.bedroom_count ?? 0;
    const bathrooms = listing.bathrooms ?? listing.bathroom_count ?? 0;

    return (
        <>
            <nav>
                <NavBar/>
            </nav>

            <div className="sell-ListingDetails">
                <LeftSection
                    images={listing.images || []}
                    status_icon={status_icon}
                    title={listing.slug || ""}
                    description={listing.description || ""}
                    verificationStatus={listing.verification_status || listing.status}
                />
                <RightSection
                    address={address}
                    region={region}
                    price={priceValue}
                    propertyType={propertyType}
                    area={areaValue}
                    bedrooms={bedrooms}
                    bathrooms={bathrooms}
                />
            </div>

        </>
    );
}
