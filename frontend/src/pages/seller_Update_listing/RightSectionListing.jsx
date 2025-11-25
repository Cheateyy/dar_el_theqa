import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";
import pauseBtnIcon from "../../assets/images/pause.png";
import Select from "react-select";

export default function ListingRightSection() {
  const options = [
    { value: "algiers", label: "Algiers" },
    { value: "batna", label: "Batna" },
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

  return (
    <div className="seller-update-rightListingSection">
      <div className="seller-update-edit-rightListingSection">
        <div className="seller-updateListingAddUpdateBTNS">
          <div className="seller-updateButtons">
            <button className="seller-update-activateButton">
              <img src={pauseBtnIcon} alt="Pause" />
            </button>
            <button className="seller-update-deleteButton">
              <img src={deleteBtnIcon} alt="Delete" />
            </button>
          </div>
        </div>

        <div className="seller-update-InfoSection">
          <h1>Location</h1>

          <div className="seller-update-fieldGroup">
            <label htmlFor="wilaya-select" className="seller-update-rightSecLabel">
              Wilaya
            </label>
            <Select
              inputId="wilaya-select"
              options={options}
              placeholder="Select a Wilaya"
              styles={customSelectStyles}
              isSearchable={false} 
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label htmlFor="region-select" className="seller-update-rightSecLabel">
              Region
            </label>
            <Select
              inputId="region-select"
              options={options}
              placeholder="Select a Region"
              styles={customSelectStyles}
              isSearchable={false}  
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label htmlFor="listing-address" className="seller-update-rightSecLabel">
              Listing Address
            </label>
            <input type="text" id="listing-address" placeholder="Address"/>
          </div>


          <div className="seller-update-fieldGroup">
          <h1>Purpose and Price</h1>
            <label htmlFor="purpose-select" className="seller-update-rightSecLabel">
              Property For
            </label>
            <Select
              inputId="purpose-select"
              options={[
                { value: "sale", label: "Sale" },
                { value: "rent", label: "Rent" },
              ]}
              placeholder="Sale/Rent"
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div className="seller-update-fieldGroup">
            <label htmlFor="price" className="seller-update-rightSecLabel">
              Price
            </label>
            <input type="text" id="price" placeholder="Price DZD"/>
          </div>

          <div className="seller-update-fieldGroup">
            <label htmlFor="method-select" className="seller-update-rightSecLabel">
              Payment Per
            </label>
            <Select
              inputId="method-select"
              options={[
                { value: "day", label: "Day" },
                { value: "month", label: "Month" },
              ]}
              placeholder="Unit of Time"
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

         

          <div className="seller-update-additionalFields">
             <h1>Additional Information</h1>
            <div className="seller-update-fieldGroup">
              <label>Area</label>
              <input type="text" placeholder="min m²"/>
            </div>
            <div className="seller-update-fieldGroup">
              <label>Floors</label>
              <input type="text" placeholder="Number of floors"/>
            </div>
            <div className="seller-update-fieldGroup">
              <label>Bedrooms</label>
              <input type="text" placeholder="Number of bedrooms"/>
            </div>
            <div className="seller-update-fieldGroup">
              <label>Bathrooms</label>
              <input type="text" placeholder="Number of bathrooms"/>
            </div>
          </div>
            <div className="seller-update-savebtn">
          <button className="seller-update-saveButton">Save Changes</button>
            </div>
        </div>
      </div>
    </div>
  );
}
