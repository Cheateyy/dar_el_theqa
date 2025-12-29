import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";

const noop = () => {};

export default function UpperSection({ address, region, onDeleteListing = noop, isDeleting = false }) {
    return (
        <div className="admin-UpperRightSection">
            <div className="admin-updateButtons">
                <button
                    type="button"
                    className="admin-deleteButton"
                    onClick={onDeleteListing}
                    disabled={isDeleting}
                    title="Delete listing"
                    aria-label="Delete listing"
                    aria-busy={isDeleting}
                >
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="admin-upper">
                <div className="admin-upperRight">
                    <h2>Address : {address}</h2>
                    <h3>{region}</h3>
                </div>
            </div>
        </div>
    );
}
