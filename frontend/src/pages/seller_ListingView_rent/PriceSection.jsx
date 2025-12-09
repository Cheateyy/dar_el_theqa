import './PriceSection.css';

const STATUS_META = {
    REJECTED: { label: "Rejected", className: "rejected" },
    APPROVED: { label: "Approved", className: "approved" },
    APPROVED_AND_PENDING: { label: "Approved & Pending", className: "approved-pending" },
    PENDING: { label: "Pending", className: "pending" },
    PARTIAL: { label: "Pending", className: "partial" },
    INACTIVE: { label: "Inactive", className: "inactive" },
    PAUSED: { label: "Paused", className: "paused" },
    RENTED: { label: "Rented", className: "rented" },
};

const formatCurrencyLabel = (unit) => {
    if (!unit) return 'DZD';
    const pretty = unit.charAt(0) + unit.slice(1).toLowerCase();
    return `DZD / ${pretty}`;
};

const getStatusInfo = (status) => {
    const normalized = typeof status === 'string' ? status.toUpperCase() : 'INACTIVE';
    return STATUS_META[normalized] || STATUS_META.INACTIVE;
};

export default function PriceSection({ price = 0, status = '', rentUnit }) {
    const statusInfo = getStatusInfo(status);

    return (
        <div className="seller-rent-priceSection cardWrapper">
            <div className="seller-rent-priceRow">
                <h1>{Number(price || 0).toLocaleString()}</h1>
                <span className="seller-rent-currency">{formatCurrencyLabel(rentUnit)}</span>
            </div>

            <div className="seller-rent-statusRow">
                <div className="seller-rent-status">
                    <p className={statusInfo.className}>
                        {statusInfo.label}
                    </p>
                </div>
            </div>
        </div>
    );
}
