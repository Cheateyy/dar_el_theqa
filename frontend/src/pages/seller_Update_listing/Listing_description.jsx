import './Listing.css';

export default function ListingDescription({ descriptionData = {}, onChange }) {
  const { title = "", description = "" } = descriptionData;

  const handleTitleChange = (e) => {
    onChange &&
      onChange({
        ...descriptionData,
        title: e.target.value,
      });
  };

  const handleDescriptionChange = (e) => {
    onChange &&
      onChange({
        ...descriptionData,
        description: e.target.value,
      });
  };

  return (
    <div className="seller-update-listing-description">
      <h3>Listing Title</h3>
      <input
        type="text"
        placeholder="Enter listing title..."
        value={title}
        onChange={handleTitleChange}
      />

      <h3>Listing Description</h3>
      <textarea
        rows="15"
        placeholder="Write a description..."
        value={description}
        onChange={handleDescriptionChange}
      />
    </div>
  );
}
