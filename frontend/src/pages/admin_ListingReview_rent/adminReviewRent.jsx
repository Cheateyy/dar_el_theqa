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
    approveAdminListing,
    approveAdminListingDocument,
    rejectAdminListingDocument,
    rejectAdminListing,
    deleteAdminListing,
    getAdminListingAllReviews,
    deleteAdminReview,
} from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function AdminReviewRent() {
    const { listingId } = useParams();
    const [showLogin, setShowLogin] = useState(false);
    const [listing, setListing] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("Listing processed successfully.");

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [data, docs, reviewsPayload] = await Promise.all([
                    getAdminListingDetails(listingId),
                    getListingDocuments(listingId),
                    getAdminListingAllReviews(listingId),
                ]);

                setListing(data || {});

                const normalizedDocs = (docs || []).map((doc) => ({
                    name: doc.document_type || doc.label || doc.type || "Document",
                    url: doc.file || doc.url || "#",
                    icon: document_icon,
                    status: doc.status || "PENDING",
                    docId: doc.id,
                    reviewComment: doc.admin_note || "",
                }));
                setDocuments(normalizedDocs);
                setReviews(Array.isArray(reviewsPayload) ? reviewsPayload : []);
            } catch (err) {
                console.error("Error fetching listing data:", err);
                setListing({});
                setDocuments([]);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [listingId]);

    const handleApproveListing = async () => {
        try {
            setIsApproving(true);
            const res = await approveAdminListing(listingId);
            console.log("Listing approved:", res);
            setListing((prev) => ({ ...prev, status: "APPROVED", status_label: "APPROVED" }));
        } catch (err) {
            console.error("Error approving listing:", err);
        } finally {
            setIsApproving(false);
        }
    };

    const handleRejectDocument = async (docId, reason) => {
        if (!reason) {
            return;
        }
        try {
            const res = await rejectAdminListingDocument(listingId, docId, reason);
            console.log("Document rejected:", res);
            setDocuments((prev) =>
                prev.map((doc) =>
                    doc.docId === docId
                        ? { ...doc, status: "REJECTED", reviewComment: reason }
                        : doc
                )
            );
        } catch (err) {
            console.error("Error rejecting document:", err);
        }
    };

    const handleAcceptDocument = async (docId, reason = "") => {
        try {
            const res = await approveAdminListingDocument(listingId, docId, reason);
            const adminNote = res?.admin_note ?? reason ?? "";
            setDocuments((prev) =>
                prev.map((doc) =>
                    doc.docId === docId
                        ? { ...doc, status: "APPROVED", reviewComment: adminNote }
                        : doc
                )
            );
        } catch (err) {
            console.error("Error approving document:", err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteAdminReview(reviewId);
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } catch (err) {
            console.error("Error deleting review:", err);
        }
    };

    const handleRejectListing = async () => {
        const reason = window.prompt("Enter rejection reason (optional):", "");
        if (reason === null) {
            return;
        }
        try {
            setIsRejecting(true);
            await rejectAdminListing(listingId, reason || "");
            setFeedbackMessage("Listing rejected successfully.");
            setIsDeleted(true);
        } catch (err) {
            console.error("Error rejecting listing:", err);
        } finally {
            setIsRejecting(false);
        }
    };

    const handleDeleteListing = async () => {
        if (!window.confirm("Delete this listing?")) {
            return;
        }
        try {
            setIsDeleting(true);
            await deleteAdminListing(listingId);
            setFeedbackMessage("Listing deleted successfully.");
            setIsDeleted(true);
        } catch (err) {
            console.error("Error deleting listing:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
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

    if (!listing || Object.keys(listing).length === 0)
        return <div>Listing not found</div>;

    const normalizedStatus = listing.listing_status || listing.status || "PENDING";
    const verificationStatus = listing.verification_status || normalizedStatus;
    const verificationIcon = getVerificationIcon(verificationStatus);

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>

            <div className="admin-rent-ListingDetails">
                <LeftSection
                    images={listing.images || []}
                    certifiedIcon={verificationIcon}
                    status_icon={verificationIcon}
                    title={listing.slug || "Property Title"}
                    description={listing.description || ""}
                    documents={documents}
                    onRejectDocument={handleRejectDocument}
                    onAcceptDocument={handleAcceptDocument}
                    verificationStatus={verificationStatus}
                    reviews={reviews}
                    onDeleteReview={handleDeleteReview}
                />


                <RightSection
                    address={listing.address || "N/A"}
                    region={listing.wilaya || "N/A"}
                    price={listing.price || 0}
                    status={normalizedStatus}
                    rentUnit={listing.rent_unit}
                    propertyType={listing.property_type || "N/A"}
                    area={listing.area || 0}
                    bedrooms={listing.bedrooms || 0}
                    bathrooms={listing.bathrooms || 0}
                    onApprove={handleApproveListing}
                    onReject={handleRejectListing}
                    onDelete={handleDeleteListing}
                    isApproving={isApproving}
                    isRejecting={isRejecting}
                    isDeleting={isDeleting}
                />
            </div>

            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
