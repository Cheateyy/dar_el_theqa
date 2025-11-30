import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";

export default function UpperSection({ address, region }) {
    return (
        <div className="admin-sell-UpperRightSection">
            <div className="admin-sell-updateButtons">
                <button className="admin-sell-deleteButton">
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="admin-sell-upper">
                <div className="admin-sell-upperRight">
                    <h2>Address : {address}</h2>
                    <h3>{region}</h3>
                </div>
            </div>
        </div>
    );
}
