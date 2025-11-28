import './PriceSection.css';

export default function PriceSection({ status, price }) {

    const getStatusStyle = () => {
        if (status === "Rejected") return { backgroundColor: "#FFE0E0", color: "#DC1919" };
        if (status === "Approved") return { backgroundColor: "#ECFEEF", color: "#1BE440" };
        if (status === "Pending") return { backgroundColor: "#FFF2D6", color: "#FFC341" };
        return { backgroundColor: "#E7E7E7", color: "#8F8F8F" };
    };

    const getStatusText = () => status;

    return (
        <div className="admin-rent-priceSection cardWrapper">
            <div className="admin-rent-priceRow">
                <h1>{price.toLocaleString()}</h1>
                <span className="admin-rent-currency">DZD / month</span>
            </div>

            <div className="admin-rent-statusRow">
                <div className="admin-rent-status">
                    <p style={getStatusStyle()}>{getStatusText()}</p>
                </div>
                <div className="admin-rent-availableDate">
                    <p>needs an admin review</p>
                </div>
            </div>
        </div>
    );
}
