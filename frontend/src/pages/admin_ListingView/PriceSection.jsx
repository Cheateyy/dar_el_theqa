import './PriceSection.css';

export default function PriceSection({ status, price }) {
    const getStatusStyle = () => {
        if (status === "Rejected") return { backgroundColor: "#FFE0E0", color: "#DC1919" };
        if (status === "Approved") return { backgroundColor: "#ECFEEF", color: "#1BE440" };
        return { backgroundColor: "#E7E7E7", color: "#8F8F8F" };
    };

    const getStatusText = () => status || "Inactive";

    return (
        <div className="admin-priceSection cardWrapper">
            <div className="admin-priceRow">
                <h1>{price.toLocaleString()}</h1>
                <span className="admin-currency">DZD / month</span>
            </div>

            <div className="admin-statusRow">
                <div className="admin-status">
                    <p style={getStatusStyle()}>{getStatusText()}</p>
                </div>
                <div className="admin-availableDate">
                    <p>Will be activated on 15/12/2025</p>
                </div>
            </div>
        </div>
    );
}
