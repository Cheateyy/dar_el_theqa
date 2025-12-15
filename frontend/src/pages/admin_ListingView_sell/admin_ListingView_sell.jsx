import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import document_icon from "../../assets/images/legal_doc.png";
import { getVerificationIcon } from "../../utils/verificationIcon.js";

import { 
    getAdminListingDetails,
    getListingDocuments,
    getAdminListingTopReviews,
    deleteAdminReview,
} from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function AdmingListing() {
    const { listingId } = useParams();

    const [showLogin, setShowLogin] = useState(false);
    const [listing, setListing] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    // ✅ FIX: handler defined OUTSIDE useEffect
    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteAdminReview(reviewId);
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    useEffect(() => {
        async function fetchListing() {
            try {
                const [listingData, docsData, reviewsData] = await Promise.all([
                    getAdminListingDetails(listingId),
                    getListingDocuments(listingId),
                    getAdminListingTopReviews(listingId),
                ]);

                setListing(listingData);

                const formattedDocs = (docsData || []).map((doc) => ({
                    name: doc.document_type || doc.label || doc.type || "Document",
                    url: doc.file || doc.url || "#",
                    icon: document_icon,
                    status: doc.status,
                    docId: doc.id,
                    reviewComment: doc.admin_note || doc.comment || "",
                }));

                setDocuments(formattedDocs);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);

            } catch (error) {
                console.error("Failed to load admin listing:", error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        fetchListing();
    }, [listingId]);

    if (loading) return <p>Loading...</p>;
    if (!listing) return <p>Listing not found.</p>;

    const normalizedAddress = listing.street_address || listing.address || "N/A";
    const normalizedRegion = listing.region || listing.wilaya || "";
    const priceValue = Number(listing.price) || 0;
    const propertyType = listing.property_type || listing.appartement_type || "N/A";
    const areaValue = listing.area || listing.area_m2 || 0;
    const bedrooms = listing.bedrooms ?? listing.bedroom_count ?? 0;
    const bathrooms = listing.bathrooms ?? listing.bathroom_count ?? 0;
    const rentUnit = listing.rent_unit || listing.rentUnit || null;
    const availableDate = listing.available_date || listing.activation_date || null;
    const statusCode = listing.status || listing.verification_status || listing.rental_status || "PENDING";
    const transactionType = listing.transaction_type || "SELL";
    const verificationStatus = listing.verification_status || listing.status;
    const verificationIcon = getVerificationIcon(verificationStatus);

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>

            <div className="admin-ListingDetails">
                <LeftSection
                    status_icon={verificationIcon}
                    images={listing.images || []}
                    certifiedIcon={verificationIcon}
                    description={listing.description}
                    documents={documents}
                    verificationStatus={verificationStatus}
                    reviews={reviews}
                    onDeleteReview={handleDeleteReview}  // ✅ Now works
                />

                <RightSection
                    address={normalizedAddress}
                    region={normalizedRegion}
                    price={priceValue}
                    status={statusCode}
                    propertyType={propertyType}
                    area={areaValue}
                    bedrooms={bedrooms}
                    bathrooms={bathrooms}
                    rentUnit={rentUnit}
                    availableDate={availableDate}
                    transactionType={transactionType}
                />
            </div>

            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
