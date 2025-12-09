import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "./LoginModal.jsx";

import img1 from "../../assets/images/dummyPropertyImages/image1.jpg";
import img2 from "../../assets/images/dummyPropertyImages/image2.jpg";
import img3 from "../../assets/images/dummyPropertyImages/image3.jpg";
import img4 from "../../assets/images/dummyPropertyImages/image4.jpg";
import img5 from "../../assets/images/dummyPropertyImages/image5.jpg";
import img6 from "../../assets/images/dummyPropertyImages/image6.jpg";
import img7 from "../../assets/images/dummyPropertyImages/image7.png";
import certifiedIcon from "../../assets/icons/certified_button.png";
import legalDocIcon from "../../assets/images/legal_doc.png";

import "./ListingDetails.css";

import { getListingDetails, getMyListings } from "../../lib/api_3.js";

export default function ListingDetails_sell() {
  const { listingId } = useParams(); // must match :listingId in route
  const [showLogin, setShowLogin] = useState(false);

  const [listing, setListing] = useState(null);
  const [moreListings, setMoreListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseModal = () => setShowLogin(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchListing() {
      try {
        setLoading(true);
        console.log("Fetching SELL listing with id:", listingId);
        const data = await getListingDetails(listingId);

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

        const documents = (data.documents || data.legal_documents || []).map(
          (doc) => ({
            name: doc.name || doc.file_name || "Document",
            url: doc.url || doc.file_url || "",
            icon: legalDocIcon,
          })
        );

        const listingStatus = (data.verification_status || "PENDING").toUpperCase();
        const property = {
          type: data.property_type || "Apartment",
          area: data.area ? `${data.area} m²` : "0 m²",
          bedrooms: data.bedrooms || data.rooms || 0,
          bathrooms: data.bathrooms || 0,
          price:
            typeof data.price === "number"
              ? data.price
              : Number(data.price) || 0,
          address: data.street_address || "No address provided",
          region: data.region || data.city || "Region, Wilaya",
          description,
          status: listingStatus,
        };

        setListing({
          title,
          description,
          images,
          documents,
          property,
          verificationStatus: data.verification_status || data.status,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sell listing details", err);
        setError("Impossible de charger l'annonce.");
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

    return () => {
      isCancelled = true;
    };
  }, [listingId]);

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
              certifiedIcon={certifiedIcon}
              images={listing.images}
              description={listing.description}
              documents={listing.documents}
              title={listing.title}
              verificationStatus={listing.verificationStatus}
            />
            <RightSection property={listing.property} moreListings={moreListings} ListingId={listingId} />
          </>
        )}
      </div>

      <LoginModal show={showLogin} onClose={handleCloseModal} />
    </>
  );
}
