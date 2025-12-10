const formatPrice = (value) => {
    const numeric = Number(value || 0);
    return `${numeric.toLocaleString()} DZD`;
};

const formatLocation = (listing) => {
    if (listing.region_name && listing.wilaya_name) {
        return `${listing.region_name}, ${listing.wilaya_name}`;
    }
    return listing.wilaya_name || listing.region_name || "";
};

export default function MoreListings({ listings = [] }) {
    const hasListings = Array.isArray(listings) && listings.length > 0;

    return (
        <div className="rent-moreListings card">
            <h2>Similar Listings</h2>

            <div className="rent-moreListingsCards">
                {hasListings ? (
                    listings.slice(0, 3).map((listing) => (
                        <div key={listing.id || listing.slug} className="rent-listingCard">
                            {listing.cover_image && (
                                <div
                                    className="rent-listingCard-image"
                                    style={{
                                        backgroundImage: `url(${listing.cover_image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        minHeight: "120px",
                                    }}
                                />
                            )}
                            <div className="rent-listingCard-body">
                                <p className="rent-listingCard-type">{listing.transaction_type}</p>
                                <h3>{listing.title}</h3>
                                <p className="rent-listingCard-location">{formatLocation(listing)}</p>
                                <p className="rent-listingCard-price">{formatPrice(listing.price)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="rent-listingCard-empty">No similar listings yet.</p>
                )}
            </div>
        </div>
    );
}
