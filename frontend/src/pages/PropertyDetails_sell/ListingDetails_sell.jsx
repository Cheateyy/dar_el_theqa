import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import { getVerificationIcon } from "../../utils/verificationIcon.js";

import {
    getListingDetails,
    toggleListingFavorite,
    sendListingInterest,
    getSimilarListings,
} from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function ListingDetails_sell() {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [interestLoading, setInterestLoading] = useState(false);
    const [similarListings, setSimilarListings] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await getListingDetails(listingId);
                setListing(data);
                setLiked(Boolean(data?.is_liked));

                try {
                    //const similarData = await getSimilarListings(listingId);
                    const normalized = Array.isArray(similarData)
                        ? similarData
                        : Array.isArray(similarData?.results)
                            ? similarData.results
                            : [];
                    setSimilarListings(normalized);
                } catch (similarError) {
                    console.error("Failed to load similar listings:", similarError);
                    setSimilarListings([]);
                }
            } catch (err) {
                console.error("Error fetching listing data:", err);
                setListing(null);
                setSimilarListings([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [listingId]);

    const handleToggleFavorite = async (nextState) => {
        const previous = liked;
        setLiked(nextState);
        try {
            const response = await toggleListingFavorite(listingId);
            if (response?.status === "removed") {
                setLiked(false);
            } else if (response?.status === "added") {
                setLiked(true);
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            setLiked(previous);
            window.alert("Unable to update favorites. Please try again.");
        }
    };

    const handleSendInterest = async (message) => {
        setInterestLoading(true);
        try {
            await sendListingInterest(listingId, message);
            window.alert("Message sent to the owner.");
        } catch (error) {
            console.error("Failed to send interest", error);
            window.alert("Unable to send your message right now. Please try again.");
        } finally {
            setInterestLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!listing) return <Navigate to="/404" replace />;

    const address = listing.street_address || listing.address || "N/A";
    const region = listing.region || listing.wilaya || "N/A";
    const priceValue = Number(listing.price) || 0;
    const propertyType = listing.property_type || listing.appartement_type || "N/A";
    const areaValue = listing.area || listing.area_m2 || 0;
    const bedrooms = listing.bedrooms ?? listing.bedroom_count ?? 0;
    const bathrooms = listing.bathrooms ?? listing.bathroom_count ?? 0;
    const verificationStatus = listing.verification_status || listing.status;
    const verificationIcon = getVerificationIcon(verificationStatus);

    return (
        <>
            <nav>
                <NavBar/>
            </nav>

            <div className="sell-ListingDetails">
                <LeftSection
                    images={listing.images || []}
                    status_icon={verificationIcon}
                    title={listing.slug || ""}
                    description={listing.description || ""}
                    verificationStatus={verificationStatus}
                    similarListings={similarListings}
                />
                <RightSection
                    property={{
                        address,
                        region,
                        price: priceValue,
                        status: listing.verification_status || listing.status,
                        type: propertyType,
                        area: areaValue,
                        bedrooms,
                        bathrooms,
                    }}
                    liked={liked}
                    onToggleLike={handleToggleFavorite}
                    onShowInterest={handleSendInterest}
                    isSendingInterest={interestLoading}
                    similarListings={similarListings}
                />
            </div>

        </>
    );
}
