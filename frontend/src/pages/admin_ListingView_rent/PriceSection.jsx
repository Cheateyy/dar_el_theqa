import "./PriceSection.css";

const STATUS_CONFIG = {
    APPROVED: { label: "Approved", tone: "success" },
    ACCEPTED: { label: "Approved", tone: "success" },
    PENDING: { label: "Pending review", tone: "warning" },
    REVIEW: { label: "Pending review", tone: "warning" },
    REJECTED: { label: "Rejected", tone: "danger" },
    AVAILABLE: { label: "Available", tone: "success" },
    RENTED: { label: "Rented", tone: "muted" },
    ACTIVE: { label: "Active", tone: "success" },
    PAUSED: { label: "Paused", tone: "muted" },
    DRAFT: { label: "Draft", tone: "default" },
};

const capitalize = (value = "") =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const formatStatus = (status = "") => {
    const key = status.toUpperCase();
    return STATUS_CONFIG[key] || { label: capitalize(status || "Pending"), tone: "default" };
};

const formatCurrency = (value) => {
    const numericValue = Number(value) || 0;
    return numericValue.toLocaleString();
};

const formatRentUnit = (rentUnit = "MONTH") => capitalize(rentUnit.replace(/_/g, " "));

const formatDateLabel = (date) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsed);
};

export default function PriceSection({
    status,
    price,
    rentUnit = "MONTH",
    availableDate,
    transactionType = "RENT",
}) {
    const { label, tone } = formatStatus(status);
    const currencyLabel = transactionType === "RENT"
        ? `DZD / ${formatRentUnit(rentUnit)}`
        : "DZD";

    const availabilityLabel = formatDateLabel(availableDate);
    const availabilityCopy = availabilityLabel
        ? `Available ${availabilityLabel}`
        : transactionType === "RENT"
            ? "Availability date pending"
            : "Activation date pending";

    return (
        <div className="admin-priceSection cardWrapper">
            <div className="admin-priceRow">
                <h1>{formatCurrency(price)}</h1>
                <span className="admin-currency">{currencyLabel}</span>
            </div>

            <div className="admin-statusRow">
                <div className="admin-status">
                    <span className={`admin-statusBadge status-${tone}`}>{label}</span>
                </div>
                <div className="admin-availableDate">
                    <p>{availabilityCopy}</p>
                </div>
            </div>
        </div>
    );
}
