const STATUS_META = {
    APPROVED: { label: "Approved", tone: "approved" },
    ACCEPTED: { label: "Approved", tone: "approved" },
    PENDING: { label: "Pending", tone: "pending" },
    REVIEW: { label: "Pending", tone: "pending" },
    REJECTED: { label: "Rejected", tone: "rejected" },
};

const formatCurrency = (value) => Number(value || 0).toLocaleString();

const getStatusMeta = (status) => {
    const normalized = (status || "PENDING").toUpperCase();
    return STATUS_META[normalized] || { label: status || "Pending", tone: "pending" };
};

export default function PriceSection({ price = 0, status }) {
    const { label, tone } = getStatusMeta(status);

    return (
        <div className="seller-sell-listingPrice">
            <div className="seller-sell-priceRow">
                <h1>{formatCurrency(price)} DZD</h1>
                <span className={`seller-sell-statusBadge ${tone}`}>{label}</span>
            </div>
        </div>
    );
}
