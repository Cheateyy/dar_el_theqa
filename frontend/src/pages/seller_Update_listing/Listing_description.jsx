import './Listing.css';

export default function ListingDescription({ descriptionData = {} }) {
    const { title = '', description = '' } = descriptionData;

    return (
        <div className="seller-update-listing-description">
            <h3>Listing Title</h3>
            <input type="text" placeholder="Enter listing title..." value={title} />

            <h3>Listing Description</h3>
            <textarea rows="15" placeholder="Write a description...">{description}</textarea>
        </div>
    );
}
