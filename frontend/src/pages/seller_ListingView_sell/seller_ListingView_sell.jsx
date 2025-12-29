import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "./LoginModal.jsx";
import ReasonModal from "../../components/common/ReasonModal.jsx";

import img1 from "../../assets/images/dummyPropertyImages/image1.jpg";
import img2 from "../../assets/images/dummyPropertyImages/image2.jpg";
import img3 from "../../assets/images/dummyPropertyImages/image3.jpg";
import img4 from "../../assets/images/dummyPropertyImages/image4.jpg";
import img5 from "../../assets/images/dummyPropertyImages/image5.jpg";
import img6 from "../../assets/images/dummyPropertyImages/image6.jpg";
import img7 from "../../assets/images/dummyPropertyImages/image7.png";
import legalDocIcon from "../../assets/images/legal_doc.png";
import { getVerificationIcon } from "../../utils/verificationIcon.js";

import "./ListingDetails.css";

import {
  getListingDetails,
  getListingDocuments,
  getMyListings,
  getListingReviews,
  activateSellerListing,
  pauseSellerListing,
  deleteSellerListing,
} from "../../lib/api_3.js";

const formatDocumentLabel = (value, fallback) => {
  if (!value || typeof value !== "string") return fallback;
  return value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

const mapListingDocuments = (docs = []) => {
  const safeDocs = Array.isArray(docs) ? docs : [];
  return safeDocs.map((doc, index) => ({
    id: doc.id ?? index,
    name:
      doc.name ||
      doc.file_name ||
      formatDocumentLabel(doc.document_type, `Document ${index + 1}`),
    url: doc.url || doc.file_url || doc.file || "",
    icon: legalDocIcon,
    status: (doc.status || "PENDING").toUpperCase(),
    adminNote: doc.admin_note || "",
  }));
};

export default function ListingDetails_sell() {
  const { listingId } = useParams(); // must match :listingId in route
  const [showLogin, setShowLogin] = useState(false);

  const [listing, setListing] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [moreListings, setMoreListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseModal = () => setShowLogin(false);

  const updateListingStatus = (nextStatus) => {
    setListing((prev) => {
      if (!prev) return prev;
      const safeStatus = (nextStatus || prev?.property?.status || "").toUpperCase();
      return {
        ...prev,
        property: {
          ...prev.property,
          status: safeStatus,
        },
      };
    });
  };

  useEffect(() => {
    let isCancelled = false;

    async function fetchListing() {
      try {
        setLoading(true);
        console.log("Fetching SELL listing with id:", listingId);
        const data = await getListingDetails(listingId);
        let docPayload = [];
        try {
          docPayload = await getListingDocuments(listingId);
        } catch (docErr) {
          console.error("Failed to fetch listing documents", docErr);
        }

        if (isCancelled) return;

        const images =
          data.images && data.images.length
            ? data.images
            : [img1, img2, img3, img4, img5, img6, img7];

        const title = data.title || "Property Title";

        const description =
          data.description ||
          data.summary ||
          "No description available for this property.";

        const normalizedDocuments = mapListingDocuments(docPayload);
        setDocuments(normalizedDocuments);

        const listingStatus = (
          data.status_label ||
          data.status ||
          data.verification_status ||
          "PENDING"
        ).toUpperCase();
        const verificationStatus = data.verification_status || data.status;
        const property = {
          type: data.property_type || "Apartment",
          area: data.area ? `${data.area} m²` : "0 m²",
          bedrooms: data.bedrooms || data.rooms || 0,
          bathrooms: data.bathrooms || 0,
          price:
            typeof data.price === "number"
              ? data.price
              : Number(data.price) || 0,
          address: data.address || "No address provided",
          region: data.region || data.city || "Region, Wilaya",
          description,
          status: listingStatus,
        };

        setListing({
          title,
          description,
          images,
          property,
          verificationStatus,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sell listing details", err);
        setError("Impossible de charger l'annonce.");
        setDocuments([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    if (listingId) {
      fetchListing();
    } else {
      console.warn("No listingId in route params for SELL");
      setLoading(false);
      setError("Invalid listing id.");
    }

    return () => {
      isCancelled = true;
    };
  }, [listingId]);

  useEffect(() => {
    let isCancelled = false;

    async function fetchSellerListings() {
      try {
        const data = await getMyListings();
        if (isCancelled) return;
        const remaining = (data.results || []).filter(
          (item) => String(item.id) !== String(listingId)
        );
        setMoreListings(remaining);
      } catch (err) {
        console.error("Failed to fetch seller listings", err);
        if (!isCancelled) {
          setMoreListings([]);
        }
      }
    }

    fetchSellerListings();
    async function fetchReviews() {
      try {
        const data = await getListingReviews(listingId);
        if (isCancelled) return;
        const normalized = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];
        setReviews(normalized);
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to load listing reviews", err);
          setReviews([]);
        }
      }
    }

    fetchReviews();

    return () => {
      isCancelled = true;
    };
  }, [listingId]);

  const handleActivateListing = async () => {
    if (!listingId) return;
    try {
      setIsActivating(true);
      const response = await activateSellerListing(listingId);
      const nextStatus = response?.status || response?.new_status || response?.listing_status;
      if (nextStatus) {
        updateListingStatus(nextStatus);
      }
      window.alert(response?.message || "Listing activated.");
    } catch (err) {
      console.error("Failed to activate listing", err);
      window.alert("Impossible d'activer l'annonce pour le moment.");
    } finally {
      setIsActivating(false);
    }
  };

  const handlePauseListing = async () => {
    if (!listingId) return;
    try {
      setIsPausing(true);
      const response = await pauseSellerListing(listingId, { reason: "OTHER" });
      const nextStatus = response?.status || response?.new_status || response?.listing_status;
      if (nextStatus) {
        updateListingStatus(nextStatus);
      }
      window.alert(response?.message || "Listing paused.");
    } catch (err) {
      console.error("Failed to pause listing", err);
      window.alert("Impossible de mettre l'annonce en pause.");
    } finally {
      setIsPausing(false);
    }
  };

  const handleOpenDeleteModal = () => {
    if (!listingId) return;
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteListing = async (reason) => {
    if (!listingId) return;

    try {
      setIsDeleting(true);
      await deleteSellerListing(listingId, reason || "SOLD");
      updateListingStatus("DELETED");
      window.alert("Listing deleted.");
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete listing", err);
      window.alert("Impossible de supprimer l'annonce.");
    } finally {
      setIsDeleting(false);
    }
  };

  const normalizedStatus = (listing?.property?.status || "").toUpperCase();
  const verificationIcon = getVerificationIcon(listing?.verificationStatus);
  const shouldActivateStatus =
    normalizedStatus === "" ||
    normalizedStatus === "PAUSED" ||
    normalizedStatus === "INACTIVE" ||
    normalizedStatus === "REJECTED" ||
    normalizedStatus === "PENDING" ||
    normalizedStatus === "DELETED";
  const statusActionLabel = shouldActivateStatus ? "Activate" : "Pause";
  const statusActionHandler = shouldActivateStatus
    ? handleActivateListing
    : handlePauseListing;
  const statusActionLoading = shouldActivateStatus ? isActivating : isPausing;

  if (!loading && !listing) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <nav>
        <NavBar onLoginClick={handleLoginClick} />
      </nav>

      <div className="seller-sell-ListingDetails">
        {loading && <p className="listingdetails-loading">Loading...</p>}
        {error && !loading && (
          <p className="listingdetails-error">{error}</p>
        )}
        {!loading && !error && listing && (
          <>
            <LeftSection
              certifiedIcon={verificationIcon}
              images={listing.images}
              description={listing.description}
              documents={documents}
              title={listing.title}
              verificationStatus={listing.verificationStatus}
              reviews={reviews}
            />
            <RightSection
              property={listing.property}
              moreListings={moreListings}
              ListingId={listingId}
              onToggleStatus={statusActionHandler}
              statusActionLabel={statusActionLabel}
              isStatusLoading={statusActionLoading}
                onDeleteListing={handleOpenDeleteModal}
              isDeletingListing={isDeleting}
            />
          </>
        )}
      </div>

      <ReasonModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onSubmit={handleDeleteListing}
        isSubmitting={isDeleting}
        title="Delete Listing"
        description="Let us know why you're removing this listing so we can keep your account history accurate."
        placeholder="Example: Property sold, duplicate entry, incorrect details, etc."
        confirmLabel="Delete listing"
        requireReason
      />

      <LoginModal show={showLogin} onClose={handleCloseModal} />
    </>
  );
}
