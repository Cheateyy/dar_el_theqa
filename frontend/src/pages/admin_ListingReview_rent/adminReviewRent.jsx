import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";
import document_icon from "../../assets/images/legal_doc.png";
import status_icon from "../../assets/icons/certified_button.png";

import {
    getAdminListingDetails,
    getAdminListingDocuments,
    approveAdminListing,
    rejectAdminListingDocument,
    deleteAdminListing,
} from "../../lib/api_3.js";

import "./ListingDetails.css";

export default function AdminReviewRent() {
    const { listingId } = useParams();
    const [showLogin, setShowLogin] = useState(false);
    const [listing, setListing] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const handleLoginClick = () => setShowLogin(true);
    const handleCloseModal = () => setShowLogin(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await getAdminListingDetails(listingId);
                setListing(data || {});

                const docs = await getAdminListingDocuments(listingId);
                setDocuments(docs || []);
            } catch (err) {
                console.error("Error fetching listing data:", err);
                setListing({});
                setDocuments([]);
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
                    doc.doc_id === docId ? { ...doc, status: "REJECTED" } : doc
                )
            );
        } catch (err) {
            console.error("Error rejecting document:", err);
        }
    };

    const handleAcceptDocument = (docId) => {
        setDocuments((prev) =>
            prev.map((doc) =>
                doc.doc_id === docId ? { ...doc, status: "ACCEPTED" } : doc
            )
        );
    };

    const handleDeleteListing = async () => {
        if (!window.confirm("Delete this listing?")) return;
        try {
            setIsDeleting(true);
            await deleteAdminListing(listingId);
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
                <div className="admin-feedback-message">Listing deleted successfully.</div>
                <LoginModal show={showLogin} onClose={handleCloseModal} />
            </>
        );
    }

    if (!listing || Object.keys(listing).length === 0)
        return <div>Listing not found</div>;

    return (
        <>
            <nav>
                <NavBar onLoginClick={handleLoginClick} />
            </nav>

            <div className="admin-rent-ListingDetails">
                <LeftSection
                    images={listing.images || []}
                    document_icon={document_icon}
                    status_icon={status_icon}
                    title={listing.slug || "Property Title"}
                    description={listing.description || ""}
                    documents={documents.map((doc) => ({
                        name: doc.files?.[0]?.filename || doc.label || "Document",
                        url: doc.files?.[0]?.url || "#",
                        icon: document_icon,
                        status: doc.status || "PENDING",
                        docId: doc.doc_id,
                    }))}
                    onRejectDocument={handleRejectDocument}
                    onAcceptDocument={handleAcceptDocument}
                    verificationStatus={listing.verification_status || listing.status}
                />


                <RightSection
                    address={listing.address || "N/A"}
                    region={listing.wilaya || "N/A"}
                    price={listing.price || 0}
                    status={listing.status || "PENDING"}
                    rentUnit={listing.rent_unit}
                    propertyType={listing.appartement_type || "N/A"}
                    area={listing.area_m2 || 0}
                    bedrooms={listing.bedrooms || 0}
                    bathrooms={listing.bathrooms || 0}
                    onApprove={handleApproveListing}
                    onDelete={handleDeleteListing}
                    isApproving={isApproving}
                    isDeleting={isDeleting}
                />
            </div>

            <LoginModal show={showLogin} onClose={handleCloseModal} />
        </>
    );
}
