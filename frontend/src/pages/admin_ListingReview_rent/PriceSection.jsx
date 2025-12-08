import './PriceSection.css';

const STATUS_TOKENS = {
    APPROVED: { label: "Approved", style: { backgroundColor: "#ECFEEF", color: "#1BE440" } },
    APPROVED_AND_PENDING: { label: "Approved & Pending", style: { backgroundColor: "#E5EFFF", color: "#0F405E" } },
    PENDING: { label: "Pending", style: { backgroundColor: "#FFF2D6", color: "#FFC341" } },
    PARTIAL: { label: "Pending", style: { backgroundColor: "#FFF2D6", color: "#FFC341" } },
    REJECTED: { label: "Rejected", style: { backgroundColor: "#FFE0E0", color: "#DC1919" } },
    INACTIVE: { label: "Inactive", style: { backgroundColor: "#E7E7E7", color: "#8F8F8F" } },
};

const formatUnitLabel = (rentUnit) => {
    if (!rentUnit) return 'DZD';
    const pretty = rentUnit.charAt(0) + rentUnit.slice(1).toLowerCase();
    return `DZD / ${pretty}`;
};

export default function PriceSection({ status, price, rentUnit }) {
    const normalized = typeof status === 'string' ? status.toUpperCase() : 'PENDING';
    const statusToken = STATUS_TOKENS[normalized] || STATUS_TOKENS.INACTIVE;

    return (
        <div className="admin-rent-priceSection cardWrapper">
            <div className="admin-rent-priceRow">
                <h1>{Number(price || 0).toLocaleString()}</h1>
                <span className="admin-rent-currency">{formatUnitLabel(rentUnit)}</span>
            </div>

            <div className="admin-rent-statusRow">
                <div className="admin-rent-status">
                    <p style={statusToken.style}>{statusToken.label}</p>
                </div>
                <div className="admin-rent-availableDate">
                    <p>needs an admin review</p>
                </div>
            </div>
        </div>
    );
}
