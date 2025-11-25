import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";

export default function UpperSection({ address, region }) {
    return (
        <div className="admin-UpperRightSection">
            <div className="admin-updateButtons">
                <button className="admin-deleteButton">
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
