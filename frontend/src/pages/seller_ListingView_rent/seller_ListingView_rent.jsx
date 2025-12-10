import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/common/NavBarv1/NavBar.jsx";
import LeftSection from "./LeftSection.jsx";
import RightSection from "./RightSection.jsx";
import LoginModal from "../../components/common/LoginPopUp/LoginModal.jsx";

import img1 from "../../assets/images/dummyPropertyImages/image1.jpg";
import img2 from "../../assets/images/dummyPropertyImages/image2.jpg";
import img3 from "../../assets/images/dummyPropertyImages/image3.jpg";
import img4 from "../../assets/images/dummyPropertyImages/image4.jpg";
import img5 from "../../assets/images/dummyPropertyImages/image5.jpg";
import img6 from "../../assets/images/dummyPropertyImages/image6.jpg";
import certifiedIcon from "../../assets/icons/certified_button.png";

import "./ListingDetails.css";

import { getListingDetails } from "../../lib/api_3.js";

export default function ListingDetails_rent() {
  const { listingId } = useParams(); 
  const [showLogin, setShowLogin] = useState(false);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseModal = () => setShowLogin(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchListing() {
      try {
        setLoading(true);
        console.log("Fetching listing with id:", listingId);
        const data = await getListingDetails(listingId);

        if (isCancelled) return;

        const mapped = {
          images:
            data.images && data.images.length
              ? data.images
              : [img1, img2, img3, img4, img5, img6],
          certifiedIcon: certifiedIcon,
          address: data.street_address || "No address provided",
          region: data.region || data.city || "Region, Wilaya",
          price: data.price || 0,
          verificationStatus: data.verification_status || "PARTIAL",
          listingStatus: (data.verification_status || "PENDING").toUpperCase(),
          propertyType: data.property_type || "Apartment",
          area: data.area || data.surface || 0,
          bedrooms: data.bedrooms || data.rooms || 0,
          bathrooms: data.bathrooms || 0,
          rentUnit: data.rent_unit || null,

          title: data.title || "Property Title",
          description:
            data.description ||
            data.summary ||
            "No description available for this property.",

          documents:
            (data.documents || data.legal_documents || []).map((doc) => ({
              name: doc.name || doc.file_name || "Document",
              url: doc.url || doc.file_url || "",
              icon: certifiedIcon,
            })),
        };

        setListing(mapped);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch listing details", err);
        setError("Impossible de charger l'annonce.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    if (listingId) {
      fetchListing();
    } else {
      console.warn("No listingId in route params");
      setLoading(false);
      setError("Invalid listing id.");
    }

    return () => {
      isCancelled = true;
    };
  }, [listingId]);

  return (
    <>
      <nav>
        <NavBar onLoginClick={handleLoginClick} />
      </nav>

      <div className="seller-rent-ListingDetails">
        {loading && <p className="listingdetails-loading">Loading...</p>}
        {error && !loading && (
          <p className="listingdetails-error">{error}</p>
        )}
        {!loading && !error && listing && (
          <>
            <LeftSection
              images={listing.images}
              certifiedIcon={listing.certifiedIcon}
              documents={listing.documents}
              title={listing.title}
              description={listing.description}
              verificationStatus={listing.verificationStatus}
            />
            <RightSection
              address={listing.address}
              region={listing.region}
              price={listing.price}
              status={listing.listingStatus}
              rentUnit={listing.rentUnit}
              propertyType={listing.propertyType}
              area={listing.area}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              ListingId={listingId}
            />
          </>
        )}
      </div>

      <LoginModal show={showLogin} onClose={handleCloseModal} />
    </>
  );
}
