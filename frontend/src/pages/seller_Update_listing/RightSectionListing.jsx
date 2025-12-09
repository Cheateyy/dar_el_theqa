import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";
import pauseBtnIcon from "../../assets/images/pause.png";
import activateBtnIcon from "../../assets/images/activate-btn-icon.png";
import Select from "react-select";

const STATUS_META = {
  APPROVED: { label: "Approved", className: "seller-update-status-approved" },
  APPROVED_AND_PENDING: { label: "Approved & Pending", className: "seller-update-status-approved-pending" },
  PENDING: { label: "Pending", className: "seller-update-status-pending" },
  PARTIAL: { label: "Pending", className: "seller-update-status-pending" },
  INACTIVE: { label: "Inactive", className: "seller-update-status-inactive" },
  PAUSED: { label: "Paused", className: "seller-update-status-paused" },
  RENTED: { label: "Rented", className: "seller-update-status-rented" },
  DELETED: { label: "Deleted", className: "seller-update-status-deleted" },
};

const getStatusMeta = (statusCode) => {
  if (!statusCode) return STATUS_META.INACTIVE;
  const normalized = statusCode.toUpperCase();
  return STATUS_META[normalized] || STATUS_META.INACTIVE;
};

export default function ListingRightSection({
  formData,
  onFieldChange,
  onSave,
  onPause,
  onActivate,
  onDelete,
  saving,
  statusCode,
  isPausing,
  isActivating,
}) {
  const {
    wilaya,
    region,
    street_address,
    transaction_type,
    price,
    rent_unit,
    property_type,
    area,
    floors,
    bedrooms,
    bathrooms,
    available_date,
  } = formData;

  const wilayaOptions = [
    { value: "Alger", label: "Alger" },
    { value: "Batna", label: "Batna" },
  ];

  const regionOptions = [
    { value: "Hydra", label: "Hydra" },
    { value: "Sidi Yahia", label: "Sidi Yahia" },
  ];

  const transactionTypeOptions = [
    { value: "RENT", label: "Rent" },
    { value: "BUY", label: "Sale" },
  ];

  const rentUnitOptions = [
    { value: "DAY", label: "Day" },
    { value: "MONTH", label: "Month" },
    { value: "YEAR", label: "Year" },
  ];

  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "studio", label: "Studio" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "60px",
      borderRadius: "20px",
      border: "1px solid #ccc",
      fontSize: "16px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "16px",
      color: "#888",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px 12px",
      backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
      color: "#333",
    }),
  };

  const statusMeta = getStatusMeta(statusCode);
  const normalizedStatus = (statusCode || "INACTIVE").toUpperCase();
  const canActivate = ["INACTIVE", "PAUSED", "RENTED"].includes(normalizedStatus);

  return (
    <div className="seller-update-rightListingSection">
      <div className="seller-update-edit-rightListingSection">
        <div className="seller-updateListingAddUpdateBTNS">
          <div className="seller-updateButtons">
            <button
              className="seller-update-activateButton"
              type="button"
              onClick={onPause}
              disabled={isPausing || normalizedStatus === "INACTIVE"}
            >
              <img src={pauseBtnIcon} alt="Pause" />
            </button>
            <button
              className="seller-update-activateButton"
              type="button"
              onClick={onActivate}
              disabled={!canActivate || isActivating}
            >
              <img src={activateBtnIcon} alt="Activate" />
            </button>
            <button
              className="seller-update-deleteButton"
              type="button"
              onClick={onDelete}
            >
              <img src={deleteBtnIcon} alt="Delete" />
            </button>
          </div>
        </div>

        <div className="seller-update-statusWrapper">
          <span className={`seller-update-statusBadge ${statusMeta.className}`}>
            {statusMeta.label}
          </span>
          <span className="seller-update-statusNote">
            Synced with admin review
          </span>
        </div>

        <div className="seller-update-InfoSection">
          <h1>Location</h1>

          <div className="seller-update-fieldGroup">
            <label
              htmlFor="wilaya-select"
              className="seller-update-rightSecLabel"
            >
              Wilaya
            </label>
            <Select
              inputId="wilaya-select"
              options={wilayaOptions}
              placeholder="Select a Wilaya"
              styles={customSelectStyles}
              isSearchable={false}
              value={
                wilayaOptions.find((opt) => opt.value === wilaya) || null
              }
              onChange={(opt) =>
                onFieldChange("wilaya", opt ? opt.value : "")
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label
              htmlFor="region-select"
              className="seller-update-rightSecLabel"
            >
              Region
            </label>
            <Select
              inputId="region-select"
              options={regionOptions}
              placeholder="Select a Region"
              styles={customSelectStyles}
              isSearchable={false}
              value={
                regionOptions.find((opt) => opt.value === region) || null
              }
              onChange={(opt) =>
                onFieldChange("region", opt ? opt.value : "")
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label
              htmlFor="listing-address"
              className="seller-update-rightSecLabel"
            >
              Listing Address
            </label>
            <input
              type="text"
              id="listing-address"
              placeholder="Address"
              value={street_address}
              onChange={(e) =>
                onFieldChange("street_address", e.target.value)
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <h1>Purpose and Price</h1>
            <label
              htmlFor="transaction-type-select"
              className="seller-update-rightSecLabel"
            >
              Property For
            </label>
            <Select
              inputId="transaction-type-select"
              options={transactionTypeOptions}
              placeholder="Sale/Rent"
              styles={customSelectStyles}
              isSearchable={false}
              value={
                transactionTypeOptions.find(
                  (opt) => opt.value === transaction_type
                ) || null
              }
              onChange={(opt) =>
                onFieldChange("transaction_type", opt ? opt.value : "")
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label htmlFor="price" className="seller-update-rightSecLabel">
              Price
            </label>
            <input
              type="text"
              id="price"
              placeholder="Price DZD"
              value={price}
              onChange={(e) =>
                onFieldChange("price", e.target.value)
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label
              htmlFor="rent-unit-select"
              className="seller-update-rightSecLabel"
            >
              Payment Per
            </label>
            <Select
              inputId="rent-unit-select"
              options={rentUnitOptions}
              placeholder="Unit of Time"
              styles={customSelectStyles}
              isSearchable={false}
              value={
                rentUnitOptions.find((opt) => opt.value === rent_unit) ||
                null
              }
              onChange={(opt) =>
                onFieldChange("rent_unit", opt ? opt.value : "")
              }
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label
              htmlFor="property-type-select"
              className="seller-update-rightSecLabel"
            >
              Property Type
            </label>
            <Select
              inputId="property-type-select"
              options={propertyTypeOptions}
              placeholder="Select type"
              styles={customSelectStyles}
              isSearchable={false}
              value={
                propertyTypeOptions.find(
                  (opt) => opt.value === property_type
                ) || null
              }
              onChange={(opt) =>
                onFieldChange("property_type", opt ? opt.value : "")
              }
            />
          </div>

          <div className="seller-update-additionalFields">
            <h1>Additional Information</h1>
            <div className="seller-update-fieldGroup">
              <label>Area</label>
              <input
                type="text"
                placeholder="m²"
                value={area}
                onChange={(e) =>
                  onFieldChange("area", e.target.value)
                }
              />
            </div>
            <div className="seller-update-fieldGroup">
              <label>Floors</label>
              <input
                type="text"
                placeholder="Number of floors"
                value={floors}
                onChange={(e) =>
                  onFieldChange("floors", e.target.value)
                }
              />
            </div>
            <div className="seller-update-fieldGroup">
              <label>Bedrooms</label>
              <input
                type="text"
                placeholder="Number of bedrooms"
                value={bedrooms}
                onChange={(e) =>
                  onFieldChange("bedrooms", e.target.value)
                }
              />
            </div>
            <div className="seller-update-fieldGroup">
              <label>Bathrooms</label>
              <input
                type="text"
                placeholder="Number of bathrooms"
                value={bathrooms}
                onChange={(e) =>
                  onFieldChange("bathrooms", e.target.value)
                }
              />
            </div>
            <div className="seller-update-fieldGroup">
              <label>Available From</label>
              <input
                type="date"
                value={available_date || ""}
                onChange={(e) =>
                  onFieldChange("available_date", e.target.value)
                }
              />
            </div>
          </div>

          <div className="seller-update-savebtn">
            <button
              className="seller-update-saveButton"
              type="button"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
