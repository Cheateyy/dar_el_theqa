export default function PriceSection({ price, status }) {
    const getStatusStyle = () => {
        if (status === "Rejected") return { backgroundColor: "#FFE0E0", color: "#DC1919" };
        if (status === "Approved") return { backgroundColor: "#ECFEEF", color: "#1BE440" };
        if (status === "Pending") return { backgroundColor: "#FFF2D6", color: "#FFC341" };
        return { backgroundColor: "#E7E7E7", color: "#8F8F8F" };
    };

    return (
        <div className="admin-sell-listingPrice">
            <h1>{price.toLocaleString()} DA</h1>
            <div className="pendingListing">
                <p style={{...getStatusStyle(), padding: "2%", borderRadius: "5px"}}>{status}</p>
                <p>needs an admin review</p>
            </div>
        </div>
    );
}
