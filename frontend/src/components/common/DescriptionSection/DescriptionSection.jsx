const VERIFIED_STATES = new Set(["VERIFIED", "FULLY_VERIFIED", "APPROVED"]);

const getVerificationMeta = (status) => {
  const normalized = (status || "").toUpperCase();
  if (VERIFIED_STATES.has(normalized)) {
    return { label: "Verified", color: "#0f8c3a" };
  }
  return { label: "Partially Verified", color: "#d97706" };
};

export default function DescriptionSection({
  status_icon,
  certifiedIcon,
  description,
  title,
  verificationStatus,
}) {
  const iconSrc = status_icon || certifiedIcon;
  const { label, color } = getVerificationMeta(verificationStatus);

  return (
    <div className="sell-ListingInfo">
      <h1>
        {title || "Property Title"}
        <span className="sell-certifiedWrapper">
          {iconSrc && (
            <img
              src={iconSrc}
              alt="Certification"
              className="sell-certifiedIcon"
            />
          )}
          <span className="sell-certifiedTooltip" style={{ color }}>
            {label}
          </span>
        </span>
      </h1>

      <p>
        {description || "No description available for this property."}
      </p>
    </div>
  );
}
