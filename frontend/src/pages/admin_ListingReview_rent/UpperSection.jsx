import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";

export default function UpperSection({ address, region, onDelete, isDeleting }) {
    return (
        <div className="admin-rent-UpperRightSection">
            <div className="admin-rent-updateButtons">
                <div className="admin-rent-delete-btn"></div>
                <button
                    className="admin-rent-deleteButton"
                    type="button"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="admin-rent-upper">
                <div className="admin-rent-upperRight">
                    <h2>Address : {address}</h2>
                    <h3>{region}</h3>
                </div>
            </div>
        </div>
    );
}
