import './PriceSection.css';

export default function PriceSection({ status, price }) {
    const getStatusStyle = () => {
        if (status === "rented") return { backgroundColor: "#FFF2D6", color: "#FFC341" };
        if (status === "available") return { backgroundColor: "#ECFEEF", color: "#1BE440" };
        return { backgroundColor: "#E7E7E7", color: "#8F8F8F" };
    };

    const getStatusText = () => {
        if (status === "rented") return "Rented";
        if (status === "available") return "Available";
        return "Inactive";
    };

    return (
        <div className="rent-priceSection cardWrapper">
            <div className="rent-priceRow">
                <h1>{price.toLocaleString()}</h1>
                <span className="rent-currency">DZD / month</span>
            </div>

            <div className="rent-statusRow">
                <div className="rent-status">
                    <p style={getStatusStyle()}>{getStatusText()}</p>
                </div>
                <div className="rent-availableDate">
                    <p>Will be available on 15/12/2025</p>
                </div>
            </div>
        </div>
    );
}
