const formatCurrency = (value) => Number(value || 0).toLocaleString();

export default function PriceSection({ price }) {
    return (
        <div className="sell-listingPrice">
            <h1>{formatCurrency(price)} DZD</h1>
        </div>
    );
}
