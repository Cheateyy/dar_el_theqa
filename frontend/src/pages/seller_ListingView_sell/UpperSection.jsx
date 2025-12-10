import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";
import updateBtnIcon from "../../assets/images/update-btn-icon.png";
import activateBtnIcon from "../../assets/images/activate-btn-icon.png";
import { Link } from "react-router-dom";

const noop = () => {};

export default function UpperSection({
    address,
    region,
    ListingId,
    onToggleStatus = noop,
    statusActionLabel = "Activate",
    isStatusLoading = false,
    onDeleteListing = noop,
    isDeletingListing = false,
}) {
    return (
        <div className="seller-sell-UpperRightSection">
            <div className="seller-sell-updateButtons">
               <Link to={`/details/sellerUpdateListing/${ListingId}`}>
                     <button type="button" className="seller-rent-updateButton" title="Update listing">
                    <img src={updateBtnIcon} alt="Update" />
                </button>
                </Link>
                <button
                    type="button"
                    className="seller-sell-activateButton"
                    onClick={onToggleStatus}
                    disabled={isStatusLoading}
                    title={`${statusActionLabel} listing`}
                    aria-label={`${statusActionLabel} listing`}
                    aria-busy={isStatusLoading}
                >
                    <img src={activateBtnIcon} alt={statusActionLabel} />
                </button>
                <button
                    type="button"
                    className="seller-sell-deleteButton"
                    onClick={onDeleteListing}
                    disabled={isDeletingListing}
                    title="Delete listing"
                    aria-label="Delete listing"
                    aria-busy={isDeletingListing}
                >
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="seller-sell-upper">
                <div className="seller-sell-upperRight">
                    <h2>Address : {address}</h2>
                    <h3>{region}</h3>
                </div>
            </div>
        </div>
    );
}
