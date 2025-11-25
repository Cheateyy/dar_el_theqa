import ImageSection from "./ImageSection.jsx";
import DescriptionSection from "../../components/common/DescriptionSection/DescriptionSection.jsx";
import MoreListings from "./MoreListings.jsx";

export default function LeftSection({ images, certifiedIcon, description }) {
    return (
        <div className="sell-listingLeft">
            <ImageSection images={images} />
            <DescriptionSection certifiedIcon={certifiedIcon} description={description} />
            <div className="LeftSectMoreListings">
                <MoreListings />
            </div>
        </div>
    );
}
