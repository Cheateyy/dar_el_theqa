const STATUS_META = {
  REJECTED: { label: "Rejected", className: "rejected" },
  APPROVED: { label: "Approved", className: "approved" },
  APPROVED_AND_PENDING: { label: "Approved & Pending", className: "approved-pending" },
  PENDING: { label: "Pending", className: "pending" },
  INACTIVE: { label: "Inactive", className: "inactive" },
  PAUSED: { label: "Paused", className: "paused" },
  RENTED: { label: "Rented", className: "rented" },
};

const formatStatus = (value) => {
  if (!value) return STATUS_META.INACTIVE;
  const normalized = value.toUpperCase();
  return STATUS_META[normalized] || STATUS_META.INACTIVE;
};

const formatPrice = (value, unit) => {
  if (typeof value !== "number") {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return "0 DZD";
    }
    value = numeric;
  }
  const formatted = value.toLocaleString();
  if (!unit) return `${formatted} DZD`;
  const prettyUnit = unit.charAt(0) + unit.slice(1).toLowerCase();
  return `${formatted} DZD / ${prettyUnit}`;
};

const formatMetric = (value, label) => {
  const numeric = typeof value === "number" ? value : Number(value) || 0;
  return `${numeric} ${label}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export default function MoreListings({ listings = [] }) {
  if (!Array.isArray(listings) || listings.length === 0) {
    return null;
  }

  return (
    <div className="seller-rent-moreListings card">
      <h2>More Listings From You</h2>
      <div className="seller-rent-moreListingsCards">
        {listings.map((listing) => {
          const statusInfo = formatStatus(listing.status_label || listing.status);
          return (
            <div key={listing.id} className="seller-rent-listingCard">
              <div className="seller-rent-listingCard-content">
                <div className="seller-rent-listingCard-header">
                  <h3>{listing.title || "Untitled listing"}</h3>
                  <div className="seller-rent-status">
                    <p className={statusInfo.className}>{statusInfo.label}</p>
                  </div>
                </div>
                <p className="seller-rent-listingCard-meta">
                  {listing.transaction_type === "RENT" ? "For Rent" : "For Sale"}
                  {listing.created_at ? ` • ${formatDate(listing.created_at)}` : ""}
                </p>
                <div className="seller-rent-listingCard-stats">
                  <span>{formatPrice(listing.price, listing.rent_unit)}</span>
                  <span>{formatMetric(listing.views_count, "views")}</span>
                  <span>{formatMetric(listing.leads_count, "leads")}</span>
                </div>
                {listing.rejection_reason && (
                  <p className="seller-rent-listingCard-reason">
                    {listing.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
