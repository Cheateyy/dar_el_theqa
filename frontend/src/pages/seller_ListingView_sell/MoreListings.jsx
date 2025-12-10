const STATUS_META = {
    APPROVED: { label: "Approved", className: "seller-status-approved" },
    APPROVED_AND_PENDING: { label: "Approved & Pending", className: "seller-status-approved-pending" },
    PENDING: { label: "Pending", className: "seller-status-pending" },
    REJECTED: { label: "Rejected", className: "seller-status-rejected" },
    INACTIVE: { label: "Inactive", className: "seller-status-inactive" },
};

const formatStatus = (status) => {
    if (!status) {
        return { label: "Inactive", className: "seller-status-inactive" };
    }

    const normalized = status.toUpperCase();
    return STATUS_META[normalized] || STATUS_META.INACTIVE;
};

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
};

const formatPrice = (value) => {
    if (typeof value !== "number") return value || "0";
    return `${value.toLocaleString()} DZD`;
};

export default function MoreListings({ listings = [] }) {
    if (!Array.isArray(listings) || listings.length === 0) {
        return null;
    }

    return (
        <div className="seller-sell-moreListings card">
            <h2>More Listings from this user</h2>

            <div className="seller-sell-moreListingsCards">
                {listings.map((listing) => {
                    const statusInfo = formatStatus(listing.status_label);
                    return (
                        <div key={listing.id} className="seller-sell-listingCard">
                            <div className="seller-sell-listingCard-content">
                                <div className="seller-sell-listingCard-header">
                                    <h3>{listing.title}</h3>
                                    <span className={`seller-status-badge ${statusInfo.className}`}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                <p className="seller-sell-listingCard-meta">
                                    {listing.transaction_type === "RENT" ? "For Rent" : "For Sale"}
                                    {listing.created_at ? ` • ${formatDate(listing.created_at)}` : ""}
                                </p>
                                <div className="seller-sell-listingCard-stats">
                                    <span>{formatPrice(listing.price)}</span>
                                    <span>{listing.views_count} views</span>
                                    <span>{listing.leads_count} leads</span>
                                </div>
                                {listing.rejection_reason && (
                                    <p className="seller-sell-listingCard-reason">
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
