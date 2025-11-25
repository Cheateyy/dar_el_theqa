export default function PriceSection({ price }) {
    return (
        <div className="sell-listingPrice">
            <h1>{price.toLocaleString()} DA</h1>
        </div>
    );
}
