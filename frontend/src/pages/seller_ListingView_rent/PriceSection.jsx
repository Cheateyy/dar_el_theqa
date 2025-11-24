import './PriceSection.css';

export default function PriceSection({ price = 0, status = "" }) {

    const getStatusText = () => {
        switch(status) {
            case "Rejected": return "Rejected";
            case "Approved": return "Approved";
            case "Pending": return "Pending";
            default: return "Inactive";
        }
    };

    const getStatusClass = () => {
        switch(status) {
            case "Rejected": return "rejected";
            case "Approved": return "approved";
            case "Pending": return "pending";
            default: return "inactive";
        }
    };

    return (
        <div className="seller-rent-priceSection cardWrapper">
            <div className="seller-rent-priceRow">
                <h1>{price.toLocaleString()}</h1>
                <span className="seller-rent-currency">DZD / month</span>
            </div>

            <div className="seller-rent-statusRow">
                <div className="seller-rent-status">
                    <p className={getStatusClass()}>
                        {getStatusText()}
                    </p>
                </div>
                <div className="seller-rent-availableDate">
                    <p>Will be activated on 15/12/2025</p>
                </div>
            </div>
        </div>
    );
}
