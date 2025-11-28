import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";
import updateBtnIcon from "../../assets/images/update-btn-icon.png";
import activateBtnIcon from "../../assets/images/activate-btn-icon.png";

export default function UpperSection({ address, region }) {
    return (
        <div className="seller-rent-UpperRightSection">
            <div className="seller-rent-updateButtons">
                <button className="seller-rent-updateButton">
                    <img src={updateBtnIcon} alt="Update" />
                </button>
                <button className="seller-rent-activateButton">
                    <img src={activateBtnIcon} alt="Activate" />
                </button>
                <button className="seller-rent-deleteButton">
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="seller-rent-upper">
                <div className="seller-rent-upperRight">
                    <h2>Address : {address}</h2>
                    <h3>{region}</h3>
                </div>
            </div>
        </div>
    );
}
