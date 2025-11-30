import deleteBtnIcon from "../../assets/images/delete-btn-icon.png";
import updateBtnIcon from "../../assets/images/update-btn-icon.png";
import activateBtnIcon from "../../assets/images/activate-btn-icon.png";


export default function UpperSection() {
    return (
        <div className="seller-sell-UpperRightSection">
            <div className="seller-sell-updateButtons">
                <button className="seller-sell-updateButton">
                    <img src={updateBtnIcon} alt="Update" />
                </button>
                <button className="seller-sell-activateButton">
                    <img src={activateBtnIcon} alt="Activate" />
                </button>
                <button className="seller-sell-deleteButton">
                    <img src={deleteBtnIcon} alt="Delete" />
                </button>
            </div>

            <div className="seller-sell-upper">
                <div className="seller-sell-upperRight">
                    <h2>Address : 21 street Down town, next to the hospital .</h2>
                    <h3>Region, Wilaya</h3>
                </div>
            </div>
        </div>
    );
}
