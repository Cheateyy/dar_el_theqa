import "./PriceSection.css";

const formatCurrency = (value) => Number(value || 0).toLocaleString();

const formatRentUnit = (rentUnit = "MONTH") => {
    const cleaned = rentUnit.replace(/_/g, " ").toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

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

const isAvailableStatus = (status = "") => {
    const normalized = status.toUpperCase();
    return normalized === "AVAILABLE" || normalized === "ACTIVE";
};

export default function PriceSection({ status, price, rentUnit = "MONTH", availableDate }) {
    const available = isAvailableStatus(status);
    const badgeTone = available ? "success" : "muted";
    const badgeLabel = available ? "Available" : "Inactive";
    const availabilityLabel = formatDateLabel(availableDate);
    const availabilityCopy = available
        ? "Available now"
        : availabilityLabel
            ? `Will be available on ${availabilityLabel}`
            : "Will be available soon";

    return (
        <div className="rent-priceSection cardWrapper">
            <div className="rent-priceRow">
                <h1>{formatCurrency(price)}</h1>
                <span className="rent-currency">{`DZD / ${formatRentUnit(rentUnit)}`}</span>
            </div>

            <div className="rent-statusRow">
                <div className="rent-status">
                    <span className={`rent-statusBadge status-${badgeTone}`}>{badgeLabel}</span>
                </div>
                <div className="rent-availableDate">
                    <p>{availabilityCopy}</p>
                </div>
            </div>
        </div>
    );
}
