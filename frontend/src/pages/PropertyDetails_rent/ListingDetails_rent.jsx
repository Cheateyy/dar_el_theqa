import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import status_icon from "../../assets/icons/certified_button.png";

import {
    getListingDetails,
    getListingReviews
} from "../../lib/api_3.js";


import "./ListingDetails.css";

export default function ListingDetails_rent() {
    const { listingId } = useParams();

    const [listing, setListing] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const data = await getListingDetails(listingId);
      setListing(data);

      const reviewsData = await getListingReviews(listingId);
      setReviews(reviewsData.results.slice(0, 3)); // only top 3
    } catch (err) {
      console.error("Error fetching listing data:", err);
      setListing(null);
      setReviews([]);
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
    const rentUnit = listing.rent_unit || listing.rentUnit || "MONTH";
    const availableDate = listing.available_date || listing.activation_date || null;
    const statusCode = (listing.rental_status || listing.status || "AVAILABLE").toUpperCase();
    const verificationStatus = listing.verification_status || listing.status;

    return (
        <>
            <nav>
                <NavBar/>
            </nav>

            <div className="rent-ListingDetails">
                <LeftSection
                    images={listing.images || []}
                    description={listing.description || ""}
                    status_icon={status_icon}
                    reviews={reviews}
                    title={listing.slug || ""}
                  verificationStatus={verificationStatus}

                />

                <RightSection
                  address={address}
                  region={region}
                  price={priceValue}
                  status={statusCode}
                  propertyType={propertyType}
                  area={areaValue}
                  bedrooms={bedrooms}
                  bathrooms={bathrooms}
                  reviews={reviews}
                  rentUnit={rentUnit}
                  availableDate={availableDate}
                />

            </div>

        </>
    );
}
