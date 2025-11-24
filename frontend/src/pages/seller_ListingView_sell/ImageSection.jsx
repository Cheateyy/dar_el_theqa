import ImageCarousel from "../../components/common/ImageCarousel/ImageCarousel.jsx";

export default function ImageSection({ images }) {
    return (
        <div className="seller-sell-imageScroller">
            <ImageCarousel images={images} />
        </div>
    );
}
