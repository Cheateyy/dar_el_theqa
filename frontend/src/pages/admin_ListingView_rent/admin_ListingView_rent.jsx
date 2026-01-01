import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import ReasonModal from "../../components/common/ReasonModal.jsx";
import document_icon from "../../assets/images/legal_doc.png";
import { getVerificationIcon } from "../../utils/verificationIcon.js";

import { 
    getAdminListingDetails,
    getListingDocuments,
    getAdminListingTopReviews,
    deleteAdminReview,
    deleteAdminListing,
} from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function AdmingListingRent() {
    const { listingId } = useParams();

    const [showLogin, setShowLogin] = useState(false);
    const [listing, setListing] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("Listing processed successfully.");

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

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
                    name: doc.document_type || doc.label || "Document",
                    url: doc.file || doc.url || "#",
                    icon: document_icon,
                    status: doc.status,
                    docId: doc.id,
                    reviewComment: doc.admin_note || "",
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

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteAdminReview(reviewId);
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } catch (err) {
            console.error("Failed to delete review", err);
        }
    };

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
        }
    };

    const handleDeleteListing = async (reason) => {
        try {
            setIsDeleting(true);
            await deleteAdminListing(listingId, reason || "");
            setFeedbackMessage("Listing deleted successfully.");
            setIsDeleted(true);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete listing", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (isDeleted) {
        return (
            <>
                <nav>
                    <NavBar onLoginClick={handleLoginClick} />
                </nav>
                <div className="admin-feedback-message">{feedbackMessage}</div>
                <LoginModal show={showLogin} onClose={handleCloseModal} />
            </>
        );
    }
    if (!listing) return <Navigate to="/404" replace />;

    const normalizedAddress = listing.street_address || listing.address || "N/A";
    const normalizedRegion = listing.region || listing.wilaya || "";
    const priceValue = Number(listing.price) || 0;
    const propertyType = listing.property_type || listing.appartement_type || "N/A";
    const areaValue = listing.area || listing.area_m2 || 0;
    const bedrooms = listing.bedrooms ?? listing.bedroom_count ?? 0;
    const bathrooms = listing.bathrooms ?? listing.bathroom_count ?? 0;
    const rentUnit = listing.rent_unit || listing.rentUnit || "MONTH";
    const availableDate = listing.available_date || listing.activation_date || null;
    const statusCode = listing.listing_status || listing.status || listing.rental_status || listing.verification_status || "PENDING";
    const verificationStatus = listing.verification_status || statusCode;
    const verificationIcon = getVerificationIcon(verificationStatus);
    const transactionType = listing.transaction_type || (listing.rent_unit ? "RENT" : "SELL");

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
                    onDeleteReview={handleDeleteReview}
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
                    onDeleteListing={handleOpenDeleteModal}
                    isDeletingListing={isDeleting}
                />
            </div>

            <ReasonModal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onSubmit={handleDeleteListing}
                isSubmitting={isDeleting}
                title="Delete Listing"
                description="Let the owner know why this listing is being removed."
                placeholder="Example: Violates policy, duplicate entry, incorrect data, etc."
                confirmLabel="Delete listing"
                requireReason
            />

            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
